import requests
from bs4 import BeautifulSoup
import json
import time
from typing import List, Dict, Optional
import random
import urllib3
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from datetime import datetime
import os
import sqlite3
from contextlib import contextmanager
import queue
import threading
import boto3
from decimal import Decimal
from typing import Any


# --- CONFIGURACION DYNAMO---
TABLE_NAME = "HealthData"
REGION_NAME = "us-east-1" 
TEST_LIMIT = None  # Cambiar a None para procesar todo
dynamodb: Any = boto3.resource('dynamodb', region_name=REGION_NAME)
table: Any = dynamodb.Table(TABLE_NAME)

class DecimalEncoder(json.JSONEncoder):
    """Ayuda a imprimir objetos Decimal de DynamoDB como JSON """
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

# --- END CONFIGURACION DYNAMO---

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class CMPMedicoScraperV3:

    def __init__(
        self,
        verify_ssl=False,
        max_workers=4,
        timeout=90,
        delay_range=(2, 4),
        db_file="medicos_cmp.db",
    ):
        self.base_url = "https://aplicaciones.cmp.org.pe/conoce_a_tu_medico/"
        self.verify_ssl = verify_ssl
        self.max_workers = max_workers
        self.timeout = timeout
        self.delay_range = delay_range
        self.db_file = db_file

        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ]

        self.errores = []

        # Queue para escritura thread-safe
        self.write_queue = queue.Queue()
        self.writer_thread = None
        self.stop_writer = threading.Event()

        # Inicializar DB Dynamo
        # Inicializar DB Dynamo
        self.dynamodb: Any = boto3.resource('dynamodb', region_name=REGION_NAME)
        self.table: Any = self.dynamodb.Table(TABLE_NAME)

        self._init_database()
    def _init_database(self):
        """Crea la base de datos SQLite con índices"""
        conn = sqlite3.connect(self.db_file)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS medicos (
                cmp TEXT PRIMARY KEY,
                apellidos TEXT,
                ap_materno TEXT,
                nombres TEXT,
                url_detalle TEXT,
                estado TEXT DEFAULT 'PENDIENTE',
                consejo_regional TEXT,
                ultima_actualizacion TEXT,
                detalle_actualizado TEXT
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS especialidades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cmp TEXT,
                especialidad TEXT,
                FOREIGN KEY (cmp) REFERENCES medicos(cmp),
                UNIQUE(cmp, especialidad)
            )
        """)

        conn.execute("CREATE INDEX IF NOT EXISTS idx_estado ON medicos(estado)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_cmp_esp ON especialidades(cmp)")

        conn.commit()
        conn.close()

        logger.info(f"Base de datos iniciada: {self.db_file}")

    def _writer_worker(self):
        """
        Worker que escribe a SQLite en un ÚNICO thread.
        Evita "database is locked".
        """
        conn = sqlite3.connect(self.db_file, timeout=30)
        conn.execute("PRAGMA journal_mode=WAL")  # Write-Ahead Logging para concurrencia

        batch = []
        batch_size = 20  # Commits cada 20 inserts

        while not self.stop_writer.is_set() or not self.write_queue.empty():
            try:
                medico = self.write_queue.get(timeout=0.5)
                batch.append(medico)

                if len(batch) >= batch_size:
                    self._write_batch(conn, batch)
                    batch = []

            except queue.Empty:
                if batch:
                    self._write_batch(conn, batch)
                    batch = []
                continue

        # Escribir batch final
        if batch:
            self._write_batch(conn, batch)

        conn.close()

    def _write_batch(self, conn, batch):
        """Escribe un batch de médicos a SQLite"""
        try:
            for medico in batch:
                # Verificar si existe
                existe = conn.execute(
                    "SELECT cmp FROM medicos WHERE cmp = ?", (medico["cmp"],)
                ).fetchone()

                if existe:
                    # Actualizar
                    update_fields = []
                    params = []

                    if "estado" in medico:
                        update_fields.append("estado = ?")
                        params.append(medico["estado"])

                    if "consejo_regional" in medico:
                        update_fields.append("consejo_regional = ?")
                        params.append(medico["consejo_regional"])

                    if "detalle_actualizado" in medico:
                        update_fields.append("detalle_actualizado = ?")
                        params.append(medico["detalle_actualizado"])

                    update_fields.append("ultima_actualizacion = ?")
                    params.append(
                        medico.get("ultima_actualizacion", datetime.now().isoformat())
                    )

                    params.append(medico["cmp"])

                    if update_fields:
                        conn.execute(
                            f"UPDATE medicos SET {', '.join(update_fields)} WHERE cmp = ?",
                            params,
                        )
                else:
                    # Insertar
                    conn.execute(
                        """
                        INSERT INTO medicos 
                        (cmp, apellidos, ap_materno, nombres, url_detalle, estado, ultima_actualizacion)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                        (
                            medico["cmp"],
                            medico.get("apellidos", ""),
                            medico.get("ap_materno", ""),
                            medico.get("nombres", ""),
                            medico.get("url_detalle", ""),
                            medico.get("estado", "PENDIENTE"),
                            medico.get(
                                "ultima_actualizacion", datetime.now().isoformat()
                            ),
                        ),
                    )

                # Insertar especialidades
                for especialidad in medico.get("especialidades", []):
                    conn.execute(
                        """
                        INSERT OR IGNORE INTO especialidades (cmp, especialidad)
                        VALUES (?, ?)
                    """,
                        (medico["cmp"], especialidad),
                    )

            conn.commit()

        except Exception as e:
            logger.error(f"Error escribiendo batch: {e}")
            conn.rollback()

    def start_writer(self):
        """Inicia el thread de escritura"""
        if self.writer_thread is None or not self.writer_thread.is_alive():
            self.stop_writer.clear()
            self.writer_thread = threading.Thread(
                target=self._writer_worker, daemon=True
            )
            self.writer_thread.start()
            logger.info("Writer thread iniciado")

    def stop_writer_thread(self):
        """Detiene el thread de escritura"""
        self.stop_writer.set()
        if self.writer_thread:
            self.writer_thread.join(timeout=10)
            logger.info("Writer thread detenido")

    def insertar_medico(self, medico: Dict):
        """
        Encola médico para escritura.
        Thread-safe, no bloquea.
        """
        self.write_queue.put(medico)

    def obtener_estadisticas(self) -> Dict:
        """Obtiene estadísticas de la BD"""
        conn = sqlite3.connect(self.db_file)
        conn.row_factory = sqlite3.Row

        total = conn.execute("SELECT COUNT(*) FROM medicos").fetchone()[0]

        estados = {}
        for row in conn.execute(
            "SELECT estado, COUNT(*) as count FROM medicos GROUP BY estado"
        ):
            estados[row["estado"]] = row["count"]

        conn.close()

        return {"total_medicos": total, "estados": estados}

    def _get_headers(self):
        """Headers con User-Agent aleatorio"""
        return {
            "User-Agent": random.choice(self.user_agents),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Referer": self.base_url,
            "Cache-Control": "no-cache",
        }

    def _crear_session(self):
        """Crea sesión con retry"""
        session = requests.Session()
        session.verify = self.verify_ssl

        from requests.adapters import HTTPAdapter
        from urllib3.util.retry import Retry

        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)

        session.headers.update(self._get_headers())
        return session

    def _delay(self, factor=1.0):
        """Delay aleatorio escalable"""
        min_d, max_d = self.delay_range
        time.sleep(random.uniform(min_d * factor, max_d * factor))

    def obtener_especialidades(self) -> List[Dict]:
        """Extrae especialidades del listado principal"""
        try:
            url = f"{self.base_url}lista-especialidad.php?key=17"
            logger.info(f"Obteniendo especialidades...")

            session = self._crear_session()
            response = session.get(url, timeout=self.timeout)
            response.encoding = "utf-8"
            response.raise_for_status()

            soup = BeautifulSoup(response.content, "html.parser")
            especialidades = []

            enlaces = soup.find_all("a", href=lambda x: x and "lista-medicos-especialidad.php" in x)

            for enlace in enlaces:
                href = enlace.get("href")
                if "id=" in href and "des=" in href:
                    params = {}
                    for param in href.split("?")[1].split("&"):
                        if "=" in param:
                            key, value = param.split("=", 1)
                            params[key] = value

                    if "id" in params and "des" in params:
                        especialidades.append(
                            {
                                "id": params["id"],
                                "nombre": params["des"]
                                .replace("+", " ")
                                .replace("%20", " "),
                                "url": f"{self.base_url}{href}"
                                if not href.startswith("http")
                                else href,
                            }
                        )

            logger.info(f"{len(especialidades)} especialidades encontradas")
            return especialidades

        except Exception as e:
            logger.error(f"Error obteniendo especialidades: {e}")
            return []

    def obtener_medicos_especialidad_async(self, especialidad: Dict) -> int:
        """
        Extrae médicos de UNA especialidad.
        Encola para escritura (no bloquea).
        """
        count = 0
        try:
            url = (
                especialidad.get("url")
                or f"{self.base_url}lista-medicos-especialidad.php?id={especialidad['id']}&des={especialidad['nombre']}&key=17"
            )

            session = self._crear_session()

            logger.info(f" {especialidad['nombre']}")
            response = session.get(url, timeout=self.timeout)
            response.encoding = "utf-8"

            soup = BeautifulSoup(response.content, "html.parser")

            tabla = soup.find("table", {"width": "100%", "border": "1"})

            if tabla:
                filas = tabla.find_all("tr", class_="cabecera_tr2")

                for fila in filas:
                    cols = fila.find_all("td")
                    if len(cols) >= 4:
                        enlace_detalle = cols[0].find("a")
                        href_detalle = (
                            enlace_detalle.get("href") if enlace_detalle else None
                        )

                        medico = {
                            "cmp": cols[1].get_text(strip=True),
                            "apellidos": cols[2].get_text(strip=True),
                            "ap_materno": cols[3].get_text(strip=True)
                            if len(cols) > 3
                            else "",
                            "nombres": cols[4].get_text(strip=True)
                            if len(cols) > 4
                            else "",
                            "especialidades": [especialidad["nombre"]],
                            "url_detalle": f"{self.base_url}{href_detalle}"
                            if href_detalle and not href_detalle.startswith("http")
                            else href_detalle,
                            "ultima_actualizacion": datetime.now().isoformat(),
                        }

                        self.insertar_medico(medico)  # Encola
                        count += 1

                logger.info(f"{especialidad['nombre']}: {count} médicos")
            else:
                logger.warning(f"Sin tabla: {especialidad['nombre']}")

            return count

        except requests.Timeout:
            logger.error(f"TIMEOUT en {especialidad['nombre']} (>{self.timeout}s)")
            return 0
        except Exception as e:
            logger.error(f"Error en {especialidad['nombre']}: {e}")
            return 0

    def scrapear_listados(self, limitar: Optional[int] = None, usar_threading=True):
        """Fase 1: Extrae listados de médicos"""
        logger.info("\n" + "=" * 70)
        logger.info("FASE 1: SCRAPING DE LISTADOS")
        logger.info("=" * 70 + "\n")

        # Iniciar writer thread
        self.start_writer()

        especialidades = self.obtener_especialidades()

        if not especialidades:
            logger.error("No se obtuvieron especialidades")
            self.stop_writer_thread()
            return

        if limitar:
            especialidades = especialidades[:limitar]

        logger.info(f"Procesando {len(especialidades)} especialidades")
        logger.info(
            f"Threading: {'SÍ' if usar_threading else 'NO'} | Workers: {self.max_workers}\n"
        )

        if usar_threading:
            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                futures = {
                    executor.submit(self.obtener_medicos_especialidad_async, esp): esp
                    for esp in especialidades
                }

                for idx, future in enumerate(as_completed(futures), 1):
                    try:
                        future.result()

                        if idx % 10 == 0:
                            # Esperar que el writer procese la cola
                            time.sleep(2)
                            stats = self.obtener_estadisticas()
                            logger.info(
                                f"Checkpoint: {idx}/{len(especialidades)} | BD: {stats['total_medicos']} | Cola: {self.write_queue.qsize()}"
                            )

                        if idx % self.max_workers == 0:
                            self._delay(factor=0.5)

                    except Exception as e:
                        logger.error(f"Error en future: {e}")
        else:
            for idx, esp in enumerate(especialidades, 1):
                self.obtener_medicos_especialidad_async(esp)
                self._delay()

                if idx % 10 == 0:
                    time.sleep(2)
                    stats = self.obtener_estadisticas()
                    logger.info(
                        f"Checkpoint: {idx}/{len(especialidades)} | BD: {stats['total_medicos']}"
                    )

        # Esperar que termine de escribir
        logger.info("Esperando escritura final...")
        while not self.write_queue.empty():
            time.sleep(1)
            logger.info(f"   Cola restante: {self.write_queue.qsize()}")

        self.stop_writer_thread()

        stats = self.obtener_estadisticas()
        logger.info(f"\n{'=' * 70}")
        logger.info(f"LISTADOS COMPLETADOS: {stats['total_medicos']} médicos únicos")
        logger.info(f"{'=' * 70}\n")

    def obtener_detalle_medico(self, medico: Dict) -> Dict:
        """Extrae estado y consejo regional"""
        try:
            if not medico.get("url_detalle"):
                return medico

            session = self._crear_session()
            response = session.get(medico["url_detalle"], timeout=30)
            response.encoding = "utf-8"

            soup = BeautifulSoup(response.content, "html.parser")

            estado = "DESCONOCIDO"
            tablas = soup.find_all("table", {"width": "100%"})
            for tabla in tablas:
                texto = tabla.get_text().upper()
                if "NO HÁBIL" in texto or "NO HABIL" in texto:
                    estado = "NO HÁBIL"
                    break
                elif "HÁBIL" in texto or "HABIL" in texto:
                    estado = "HÁBIL"
                    break
                elif "FALLECIDO" in texto:
                    estado = "FALLECIDO"
                    break

            consejo_regional = "NO ENCONTRADO"
            for tabla in tablas:
                celdas = tabla.find_all("td")
                for celda in celdas:
                    texto = celda.get_text(strip=True)
                    if "CONSEJO REGIONAL" in texto.upper():
                        consejo_regional = texto
                        break
                if consejo_regional != "NO ENCONTRADO":
                    break

            medico["estado"] = estado
            medico["consejo_regional"] = consejo_regional
            medico["detalle_actualizado"] = datetime.now().isoformat()

            # Encolar para escritura
            self.insertar_medico(medico)

            return medico

        except Exception as e:
            logger.error(f"Error detalle CMP {medico.get('cmp')}: {e}")
            medico["estado"] = "ERROR"
            medico["consejo_regional"] = "ERROR"
            self.insertar_medico(medico)
            return medico

    def actualizar_detalles(self):
        """Fase 2: Actualiza detalles con threading"""
        logger.info("\n" + "=" * 70)
        logger.info("FASE 2: ACTUALIZACIÓN DE DETALLES")
        logger.info("=" * 70 + "\n")

        # Iniciar writer
        self.start_writer()

        # Obtener médicos pendientes
        conn = sqlite3.connect(self.db_file)
        conn.row_factory = sqlite3.Row
        cursor = conn.execute("""
            SELECT cmp, url_detalle 
            FROM medicos 
            WHERE estado = 'PENDIENTE' AND url_detalle IS NOT NULL
        """)
        medicos_pendientes = [
            {"cmp": row["cmp"], "url_detalle": row["url_detalle"]} for row in cursor
        ]
        conn.close()

        total = len(medicos_pendientes)
        logger.info(f"Médicos sin detalle: {total}")

        if total == 0:
            logger.info("Todos los médicos tienen detalle")
            self.stop_writer_thread()
            return

        procesados = 0

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(self.obtener_detalle_medico, medico): medico
                for medico in medicos_pendientes
            }

            for future in as_completed(futures):
                try:
                    future.result()
                    procesados += 1

                    if procesados % 50 == 0:
                        logger.info(
                            f"Procesados: {procesados}/{total} | Cola: {self.write_queue.qsize()}"
                        )

                    if procesados % (self.max_workers * 10) == 0:
                        self._delay(factor=0.3)

                except Exception as e:
                    logger.error(f"Error: {e}")

        # Esperar escritura final
        logger.info("Esperando escritura final...")
        while not self.write_queue.empty():
            time.sleep(1)

        self.stop_writer_thread()

        logger.info(f"\n{'=' * 70}")
        logger.info(f"DETALLES ACTUALIZADOS: {procesados}")
        logger.info(f"{'=' * 70}\n")

    def exportar_json_streaming(self, archivo="medicos_cmp_export.json"):
        """Exporta a JSON con streaming"""
        logger.info(f"Exportando a JSON...")

        with open(archivo, "w", encoding="utf-8") as f:
            f.write("{\n")
            f.write(f'  "metadata": {{\n')
            f.write(f'    "exportado": "{datetime.now().isoformat()}",\n')

            stats = self.obtener_estadisticas()
            f.write(f'    "total_medicos": {stats["total_medicos"]}\n')
            f.write("  },\n")
            f.write('  "medicos": [\n')

            conn = sqlite3.connect(self.db_file)
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT m.*, GROUP_CONCAT(e.especialidad, '|') as especialidades
                FROM medicos m
                LEFT JOIN especialidades e ON m.cmp = e.cmp
                GROUP BY m.cmp
            """)

            first = True
            for row in cursor:
                if not first:
                    f.write(",\n")
                first = False

                medico = dict(row)
                if medico["especialidades"]:
                    medico["especialidades"] = medico["especialidades"].split("|")
                else:
                    medico["especialidades"] = []

                f.write("    " + json.dumps(medico, ensure_ascii=False))

            conn.close()

            f.write("\n  ]\n")
            f.write("}\n")

        logger.info(f"Exportado: {archivo}")

    def exportar_csv_streaming(self, archivo="medicos_cmp_export.csv"):
        """Exporta a CSV con streaming"""
        import csv

        logger.info(f"Exportando a CSV...")

        with open(archivo, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    "CMP",
                    "Apellidos",
                    "Ap. Materno",
                    "Nombres",
                    "Especialidades",
                    "Estado",
                    "Consejo Regional",
                    "Última Actualización",
                ]
            )

            conn = sqlite3.connect(self.db_file)
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT m.*, GROUP_CONCAT(e.especialidad, '; ') as especialidades
                FROM medicos m
                LEFT JOIN especialidades e ON m.cmp = e.cmp
                GROUP BY m.cmp
            """)

            for row in cursor:
                writer.writerow(
                    [
                        row["cmp"],
                        row["apellidos"],
                        row["ap_materno"],
                        row["nombres"],
                        row["especialidades"] or "",
                        row["estado"],
                        row["consejo_regional"],
                        row["ultima_actualizacion"],
                    ]
                )

            conn.close()

        logger.info(f"Exportado: {archivo}")

    def ingestar_dynamo_desde_db(self):
        logger.info("\n" + "=" * 70)
        logger.info("FASE 3: INGESTA A DYNAMODB")
        logger.info("=" * 70 + "\n")

        conn = sqlite3.connect(self.db_file)
        conn.row_factory = sqlite3.Row
        
        cursor = conn.execute("""
            SELECT m.*, GROUP_CONCAT(e.especialidad, '|') as especialidades_str
            FROM medicos m
            LEFT JOIN especialidades e ON m.cmp = e.cmp
            GROUP BY m.cmp
        """)

        count = 0
        limit_reached = False
        
        with self.table.batch_writer() as batch:
            for row in cursor:
                if TEST_LIMIT and count >= TEST_LIMIT:
                    limit_reached = True
                    break

                try:
                    item_sqlite = dict(row)
                    especialidades_lista = []
                    if item_sqlite.get("especialidades_str"):
                        especialidades_lista = item_sqlite["especialidades_str"].split("|")
                    
                    # Construccion del item DynamoDB
                    dynamo_item = {
                        "PK": f"DOC#{item_sqlite['cmp']}",
                        "SK": "PERFIL",
                        "entity_type": "doctor",
                        "cmp": item_sqlite['cmp'],
                        "nombres": item_sqlite['nombres'],
                        "ap_paterno": item_sqlite['apellidos'],
                        "ap_materno": item_sqlite['ap_materno'],
                        "especialidades": especialidades_lista,
                        "estado_cmp": item_sqlite['estado'],
                        "consejo_regional": item_sqlite['consejo_regional'],
                        "url_detalle": item_sqlite['url_detalle'],
                        "fecha_actualizacion": item_sqlite['ultima_actualizacion']
                    }
                    
                    # Limpiar valores nulos/vacios
                    dynamo_item = {k: v for k, v in dynamo_item.items() if v}

                    # ENVIAR (Sin print de json.dumps para evitar errores)
                    batch.put_item(Item=dynamo_item)
                    count += 1
                    
                    print(f"   -> Subido DOC#{item_sqlite['cmp']}") # Feedback simple

                except Exception as e:
                    logger.error(f"Error subiendo CMP {item_sqlite.get('cmp')}: {e}")

        conn.close()
        
        if limit_reached:
            logger.info(f"Límite de prueba alcanzado ({TEST_LIMIT}).")
        
        logger.info(f"Ingesta finalizada. Total enviados a DynamoDB: {count}")



# ============================================================================
# USO
# ============================================================================

if __name__ == "__main__":
    scraper = CMPMedicoScraperV3(
        verify_ssl=False,
        max_workers=4,
        timeout=90,
        delay_range=(2, 2),
        db_file="medicos_cmp.db",
    )

    try:
        # FASE 1: Listados
        # scraper.scrapear_listados(limitar=2, usar_threading=True)

        # FASE 2: Detalles
        # scraper.actualizar_detalles()
        # Exportar
        # scraper.exportar_json_streaming()
        # FASE 3: Ingesta a DynamoDB
        scraper.ingestar_dynamo_desde_db()

    finally:
        # Asegurar que writer se detenga
        scraper.stop_writer_thread()

    # Estadísticas
    stats = scraper.obtener_estadisticas()
    print(f"\nRESUMEN:")
    print(f"   Total: {stats['total_medicos']}")
    print(f"\n   Estados:")
    for estado, count in sorted(stats["estados"].items()):
        print(f"     - {estado}: {count}")
