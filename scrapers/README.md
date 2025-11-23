# Scrapers de VitalSync

Este módulo contiene los scrapers que usamos para construir y mantener el dataset médico de VitalSync (IPRESS públicas y médicos colegiados, con la idea de extenderlo a centros privados a futuro).

La documentación está pensada para ser corta y práctica: qué hace cada scraper, de dónde saca la data, cómo se corre localmente y qué opciones de despliegue tenemos (Lambda vs EC2).

## Estructura general

- `ScraperIpress/`
	- `ScraperIpress.py`: scraper principal para establecimientos de salud IPRESS.
	- `RENIPRESS_2025_v7.csv`: dump oficial de referencia (RENIPRESS) usado para validar/complementar el scraping.
	- `example_data_ipress.txt`: ejemplo de salida/formato de datos procesados.

- `ScraperMediccos/`
	- `ScraperMedicos.py`: scraper principal para médicos registrados (CMP u otros padrones oficiales).
	- `medicos_cmp_export.csv` / `medicos_cmp_export.json`: exports de ejemplo del padrón de médicos.

- `ignore/`
	- Scripts de prueba/prototipos (`ingesta_dynamo.py`, `sincro_ipress.py`, `sync_to_dynamo.py`, `to_dynamo.py`, etc.) que muestran cómo se hace la ingesta a DynamoDB y pruebas de sincronización, pero no son parte del flujo “oficial”.

## Qué hace cada scraper

### Scraper IPRESS (`ScraperIpress/ScraperIpress.py`)

Objetivo: construir un catálogo limpio y actualizable de establecimientos de salud públicos (IPRESS), listo para ser consumido por el backend de VitalSync.

En alto nivel, el flujo es:

1. Leer/descargar información oficial de IPRESS (RENIPRESS u otra fuente pública).
2. Normalizar campos clave (códigos, nombres, dirección, distrito/provincia/departamento, tipo de establecimiento, etc.).
3. Enriquecer/validar la info con el archivo `RENIPRESS_2025_v7.csv` cuando aplica.
4. Generar una salida estructurada (CSV/JSON) que luego se puede cargar en DynamoDB u otra base de datos.

La idea a futuro es extender este mismo pipeline para también scrapear centros privados (clínicas, laboratorios, etc.), que suelen tener estructuras de datos menos estandarizadas.

### Scraper Médicos (`ScraperMediccos/ScraperMedicos.py`)

Objetivo: mantener un listado de médicos con información básica y validada contra fuentes oficiales.

Flujo general:

1. Leer el padrón de médicos (por ejemplo, export CMP) desde `medicos_cmp_export.csv` o una fuente web.
2. Parsear y limpiar los datos (nombre completo, número de colegiatura, especialidad, ubicación, etc.).
3. Opcionalmente generar `medicos_cmp_export.json` como formato listo para APIs/indexación.

## Cómo correr los scrapers localmente

### 1. Requisitos previos

- Tener configurado `aws cli` con las credenciales y región correctas (para poder leer/escribir en DynamoDB, S3, etc.).
- Tener instalado [`uv`](https://github.com/astral-sh/uv) (gestor de entornos y dependencias para Python).

### 2. Instalar dependencias

Desde la carpeta `scrapers/`:

```bash
cd scrapers

# Instalar dependencias definidas en el pyproject.toml de scrapers
uv sync
```

Esto crea/usa el entorno virtual administrado por `uv` y deja todo listo para ejecutar los scripts.

### 3. Ejecutar scrapers

```bash
# Ejecutar scraper de IPRESS
uv run ScraperIpress/ScraperIpress.py

# Ejecutar scraper de Médicos
uv run ScraperMediccos/ScraperMedicos.py
```

> Nota: si en el futuro se agregan más scrapers o una CLI unificada, la idea es concentrar la orquestación aquí (por ejemplo, un `main.py` que reciba parámetros de qué fuente correr).

## Opciones de despliegue

Los scrapers están pensados para correr en batch, no como servicio HTTP. Hay dos caminos principales que consideramos: AWS Lambda y EC2.

### 1. AWS Lambda (batch por horarios)

**Ventajas:** pago por uso, fácil de orquestar con CloudWatch Events / EventBridge para definir cada cuánto se corre (diario, semanal, por horas, etc.).

**Limitaciones y puntos a tener en cuenta:**

- Tiempo máximo de ejecución (timeout) limitado. Si el scraping es pesado, hay que partirlo en batches.
- Tamaño y manejo de dependencias (librerías de scraping, parsing, etc.) puede volverse incómodo.
- Limited CPU pero **sí se puede usar concurrencia** dentro de una Lambda (por ejemplo con `concurrent.futures.ThreadPoolExecutor`). No es “multi-core” real, pero sirve para I/O-bound (muchas requests HTTP en paralelo).

**Estrategia recomendada si se usa Lambda:**

- Dividir el scraping en lotes (por ejemplo, por región, por rango de IDs o por tipo de establecimiento).
- Una Lambda orquestadora que reciba el batch y dispare sub-tareas (o varias Lambdas en paralelo) por horario.
- Cada ejecución debería:
	- Leer solo el subset de datos que le corresponde.
	- Hacer scraping con threads para aprovechar mejor el tiempo de I/O.
	- Persistir resultados parciales en S3 o DynamoDB.

Esto reduce el riesgo de pegarse al timeout y flexibiliza la programación (batches nocturnos, etc.).

### 2. EC2 (instancia dedicada para scrapers)

**Ventajas:**

- Control total de entorno y dependencias (Python, librerías de scraping, binarios extra, etc.).
- Más fácil de extender a nuevos scrapers, especialmente si empezamos a scrapear centros privados que tienen estructuras muy distintas.
- Podemos orquestar con `cron`, `systemd` timers, containers (Docker), o un simple script scheduler.

**Desventajas:**

- Coste base mayor (instancia encendida o necesidad de automatizar apagado/encendido).
- Hay que mantener el servidor (seguridad, updates, monitoreo).

**Estrategia recomendada en EC2:**

- Usar Docker para empaquetar los scrapers y sus dependencias.
- Definir uno o varios `cron` jobs que ejecuten los scrapers por horario, pasando parámetros de batch cuando sea necesario.
- Persistir la data directamente en DynamoDB u otra base, o dejar los dumps en S3 para que el backend los consuma.

## Recomendación actual

- A corto plazo, para velocidad de desarrollo y flexibilidad (especialmente si vamos a scrapear centros privados con formatos variables), **EC2 con Docker** es más sencillo de operar y depurar.
- A mediano plazo, se puede migrar parte del pipeline (tareas bien acotadas y rápidas) a **Lambda** si necesitamos escalar más agresivamente o reducir costes en ejecuciones poco frecuentes.

## Notas finales

- Los scripts en `ignore/` son buen material de referencia para ver cómo se hace la ingesta a DynamoDB y pruebas de sincronización, pero lo ideal es ir consolidando esa lógica en un módulo común reutilizable.
- Cuando se añada un nuevo scraper (por ejemplo, centros privados), documentar aquí:
	- Fuente de datos.
	- Pasos de scraping y normalización.
	- Formato de salida y cómo se integra con el backend de VitalSync.

