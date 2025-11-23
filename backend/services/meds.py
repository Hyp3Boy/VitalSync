import base64
import logging
from typing import List
from schemas.meds import (
    Medication, 
    MedicationSearchRequest, 
    MedicationsListResponse, 
    MedicationDetailResponse,
    MedicationWithPriceAndStore
)

import requests
from core.client_db import get_typesense_client

# --- 1. REFERENCIAS GLOBALES (Asumimos que esto lo importas de tu config/main) ---
# Reemplaza esto con tus imports reales
# from config import typesense_client, http_session, DIGEMID_URL

# Constantes simples para que funcione la lógica
COLLECTION_NAME = "medications"
DIGEMID_URL = "https://ms-opm.minsa.gob.pe/msopmcovid/preciovista/ciudadano"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://opm-digemid.minsa.gob.pe",
    "Referer": "https://opm-digemid.minsa.gob.pe/"
}

# Logger
logger = logging.getLogger(__name__)

# --- 2. UTILITARIOS DE ID (Necesarios para el flujo Search -> GetById) ---

def encode_med_id(group: int, ff_group: str, conc: str) -> str:
    raw = f"{group}|{ff_group}|{conc}"
    return base64.urlsafe_b64encode(raw.encode()).decode()

def decode_med_id(med_id: str):
    decoded = base64.urlsafe_b64decode(med_id.encode()).decode()
    return decoded.split("|") # Retorna [group, ff_group, conc]


# --- 3. SERVICIO SIMPLIFICADO ---
client = get_typesense_client()

class MedService:
    
    @staticmethod
    def search_medications(payload: MedicationSearchRequest) -> MedicationsListResponse:
        """
        Busca en Typesense y genera un ID único para cada resultado.
        """
        # Usamos el cliente global directamente
        search_params = {
            "q": payload.query,
            "query_by": "name,comp_name",
            "per_page": payload.per_page,
        }

        try:
            # LLAMADA DIRECTA A TU CLIENTE GLOBAL
            results = client.collections[COLLECTION_NAME].documents.search(search_params)
            
            med_list = []
            for hit in results.get("hits", []):
                doc = hit.get("document", {})
                
                # Generamos ID para que el frontend pueda pedir detalles después
                g, ff, c = int(doc.get("group", 0)), str(doc.get("FFgroup", "")), str(doc.get("concentration", ""))
                generated_id = encode_med_id(g, ff, c)
                
                med_list.append(Medication(
                    id=generated_id,
                    comp_name=doc["comp_name"],
                    name=doc["name"],
                    concentration=c,
                    pharmaceutical_form=str(doc.get("pharmaceutical_form", "")),
                    group=g,
                    FFgroup=ff
                ))
            
            # Quitamos duplicados visuales
            unique = {m.id: m for m in med_list}.values()
            return MedicationsListResponse(results=list(unique))

        except Exception as e:
            logger.error(f"Error Typesense: {e}")
            return MedicationsListResponse(results=[])

    @staticmethod
    def get_medication_by_id(medication_id: str) -> MedicationDetailResponse:
        """
        Decodifica el ID y consulta a DIGEMID usando la sesión global.
        """
        try:
            group, ff_group, conc = decode_med_id(medication_id)
            
            body = {
                "filtro": {
                    "codGrupoFF": ff_group,
                    "codigoProducto": int(group),
                    "concent": conc,
                    # Defaults fijos (o sácalos de tu config global)
                    "codigoDepartamento": "15", 
                    "codigoProvincia": "01",
                    "codigoUbigeo": "150131",
                    "pagina": 1,
                    "tamanio": 100,
                }
            }

            # LLAMADA DIRECTA A TU SESION GLOBAL
            resp = requests.post(DIGEMID_URL, json=body, headers=HEADERS, timeout=10)
            resp.raise_for_status()
            data = resp.json()

            stores = []
            med_base = None

            for item in data.get("data", [])[:20]: # Top 20 resultados
                stores.append(MedicationWithPriceAndStore(
                    id=medication_id,
                    comp_name=item.get("nombre_comp", ""),
                    name=item.get("nombreProducto", ""),
                    concentration=item.get("concent", ""),
                    pharmaceutical_form=item.get("nombreFormaFarmaceutica", ""),
                    group=int(group),
                    FFgroup=ff_group,
                    price=float(item.get("precio2", 0)),
                    store_name=str(item.get("nombreComercial", "")),
                    store_address=str(item.get("direccion", "")),
                    store_telephone=str(item.get("telefono", "")),
                    medication_code=int(item.get("codProdE", 0)),
                    store_code=str(item.get("codEstab", ""))
                ))
            
            # Si hay resultados, tomamos el primero como base para la info del medicamento
            if stores:
                med_base = Medication(**stores[0].dict())

            return MedicationDetailResponse(medication=med_base, stores=stores)

        except Exception as e:
            logger.error(f"Error DIGEMID: {e}")
            # Retornamos vacío en caso de error
            return MedicationDetailResponse(medication=None, stores=[])