from pathlib import Path
import requests
import json
import csv
import time
from typing import Iterable, List, Dict, Optional
import boto3
from decimal import Decimal
from typing import Any
from concurrent.futures import ThreadPoolExecutor, as_completed

# --- CONFIGURACION ---
TABLE_NAME = "HealthData"
REGION_NAME = "us-east-1" 
# TEST_LIMIT = 10  <-- COMENTADO PARA QUE PROCESES TODO
TEST_LIMIT = None

# Configuración Multithreading
MAX_WORKERS = 20   # Cantidad de hilos simultaneos (20 es seguro y rapido)
BATCH_SIZE = 1000    # Guardar en BD cada 1k

dynamodb: Any = boto3.resource('dynamodb', region_name=REGION_NAME)
table = dynamodb.Table(TABLE_NAME)

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o) 
        return super(DecimalEncoder, self).default(o)


def json_decimal_loader(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f, parse_float=Decimal)

def convert_float_to_decimal(obj):
    if isinstance(obj, list):
        return [convert_float_to_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_float_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    return obj

def transformar_ipress(raw_item):
    try:
        cod_ipress = raw_item.get("COD_IPRESS")
        if not cod_ipress: return None
        
        pk = f"IPRESS#{cod_ipress}"
        sk = "METADATA"
        
        datos_extra = {}
        if "DATOS" in raw_item and isinstance(raw_item["DATOS"], list) and len(raw_item["DATOS"]) > 0:
            datos_extra = raw_item["DATOS"][0]
        
        final_item = {
            "PK": pk,
            "SK": sk,
            "entity_type": "ipress",
            "COD_IPRESS": cod_ipress,
            "ESPECIALIDADES": raw_item.get("ESPECIALIDADES", []),
            "CARTERA": raw_item.get("CARTERA", []), 
            "UPS": raw_item.get("UPS", []),
        }
        
        final_item.update(datos_extra)
        return final_item
    
    except Exception as e:
        print(f"Error procesando IPRESS {raw_item.get('COD_IPRESS')}: {e}")
        return None
    
def ingestar_datos(data_list):
    # 1. Convertimos floats a Decimals en memoria
    data_clean = convert_float_to_decimal(data_list)
    
    count = 0
    with table.batch_writer() as batch:
        for raw_item in data_clean:
            dynamo_item = transformar_ipress(raw_item) 
            if dynamo_item:
                batch.put_item(Item=dynamo_item)
                count += 1
                # print(f"IPRESS Insertado: {dynamo_item['PK']}") <-- Comentado para que no sature la consola si va muy rapido
                
    print(f" Batch guardado en DynamoDB: {count} registros")
    return count

# --- SCRAPING DE IPRESS DESDE RENIPRESS ---

CSV_PATH = Path(__file__).with_name("RENIPRESS_2025_v7.csv")

def extract_ipress_data_csv(path: Path) -> Iterable[str]:
    with path.open("r", encoding="latin-1", newline="") as file:
        reader = csv.DictReader(file, delimiter=";")
        seen: set[str] = set()
        for row in reader:
            cod = (row.get("COD_IPRESS") or "").strip()
            if not cod: continue
            if cod.isdigit(): cod = cod.zfill(8)
            if cod in seen: continue
            seen.add(cod)
            yield cod

# --- NUEVA FUNCION WORKER (Misma lógica tuya, pero para 1 solo item) ---
def worker_scrap_individual(id_buscar):
    """
    Esta función contiene TU lógica original de scraping, pero aislada para
    que pueda correr en paralelo.
    """
    data_processed = None

    # URLs
    url_pagina_visita = f"http://app20.susalud.gob.pe:8080/registro-renipress-webapp/ipress.htm?action=mostrarVer&idipress={id_buscar}"
    url_api_oculta = "http://app20.susalud.gob.pe:8080/registro-renipress-webapp/ipress.htm"

    # mantener sesión y cookies
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': url_pagina_visita,
        'Origin': 'http://app20.susalud.gob.pe:8080',
        'X-Requested-With': 'XMLHttpRequest'
    }

    session = requests.Session()

    # print(f"1. Entrando a la recepción para obtener Cookies (ID: {id_buscar})...") # Comenta esto si hay mucho ruido

    try:
        response_visita = session.get(url_pagina_visita, headers=headers, timeout=10) # Timeout agregado por seguridad
        
        if response_visita.status_code == 200:
            # print(f" Cookie obtenida ok ({id_buscar})")
            params = {"action": "cargarIpress"}
            payload = {"idipress": id_buscar}

            # print(f" consultando la API oculta ({id_buscar})...")
            response_api = session.post(url_api_oculta, params=params, data=payload, headers=headers, timeout=10)

            if response_api.status_code == 200:
                response_api.encoding = 'utf-8' 
                try:
                    data = response_api.json()
                    data = data.get('datos', {})
                    if 'error' in data:
                        print(f"El servidor respondio con erro: {data}")
                    else:
                        # Mapeo de datos (Tu logica exacta)
                        data_processed = {
                            "COD_IPRESS": data.get('p_vCO_IPRESS', id_buscar),
                            "DATOS": data.get('p_crCURSOR_DATOS', []),
                            "ESPECIALIDADES": data.get('p_crCURSOR_ESPECIALIDES', []),
                            "CARTERA": data.get('P_CURSORCARTERA') or data.get('p_crCURSOR_SERVICIOS', []), 
                            "UPS": data.get('p_crCURSOR_UPS', [])
                        }
                except json.JSONDecodeError:
                    print(f"Error: la respuesta no es un JSON valido para {id_buscar}")
            else:
                print(f"Error HTTP en la API: {response_api.status_code}")
        else:
            print(f"Error al entrar a la página inicial: {response_visita.status_code}")

    except Exception as e:
        print(f"Error crítico en ID {id_buscar}: {e}")

    return data_processed



if __name__ == "__main__":
    print("Iniciando proceso Optimizado (Multithread + Batching)...")
    
    # 1. Obtenemos TODOS los IDs del CSV
    print("Leyendo CSV completo...")
    todos_los_ids = list(extract_ipress_data_csv(CSV_PATH))
    total_registros = len(todos_los_ids)
    print(f"Total de registros a procesar: {total_registros}")

    # Si hay limite de test, cortamos la lista
    if TEST_LIMIT:
        print(f"Modo TEST activado. Limitando a {TEST_LIMIT} registros.")
        todos_los_ids = todos_los_ids[:TEST_LIMIT]


    total_ingestados = 0
    start_time_global = time.time()

    # Bucle que avanza de BATCH_SIZE en BATCH_SIZE (ej: 0..50, 50..100, etc)
    for i in range(0, len(todos_los_ids), BATCH_SIZE):
        lote_actual = todos_los_ids[i : i + BATCH_SIZE]
        resultados_lote = []
        
        print(f"\nProcesando Lote {i}/{total_registros} (Tamaño: {len(lote_actual)})...")
        
        # Multithreading: Lanzamos varios workers a la vez
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Enviamos tarea para cada ID del lote
            futures = {executor.submit(worker_scrap_individual, id_ipress): id_ipress for id_ipress in lote_actual}
            
            for future in as_completed(futures):
                res = future.result()
                if res:
                    resultados_lote.append(res)
        
        # Guardamos en DynamoDB inmediatamente (sin esperar a terminar todo)
        if resultados_lote: 
            ingestados = ingestar_datos(resultados_lote)
            total_ingestados += ingestados
        
        # Pequeña pausa para no ser baneado por IP (opcional pero recomendada)
        time.sleep(0.5)

    duration = time.time() - start_time_global
    print(f"\nPROCESO FINALIZADO.")
    print(f"Tiempo total: {duration:.2f} segundos")
    print(f"Total registros insertados en DynamoDB: {total_ingestados}/{total_registros}")