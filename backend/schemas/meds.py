import base64
from typing import List, Optional
from pydantic import BaseModel, Field

# --- UTILITARIOS PARA EL ID ---
def encode_med_id(group: int, ff_group: str, conc: str) -> str:
    """Crea un ID único combinando los datos necesarios"""
    raw = f"{group}|{ff_group}|{conc}"
    return base64.urlsafe_b64encode(raw.encode()).decode()

def decode_med_id(med_id: str):
    """Recupera los datos del ID"""
    try:
        decoded = base64.urlsafe_b64decode(med_id.encode()).decode()
        group, ff_group, conc = decoded.split("|")
        return int(group), ff_group, conc
    except Exception:
        raise ValueError("ID de medicamento inválido")

# --- MODELOS ---

class Medication(BaseModel):
    id: str                     # <--- EL NUEVO ID GENERADO
    comp_name: str
    name: str
    concentration: str
    pharmaceutical_form: str
    # Estos campos siguen siendo necesarios internamente, pero el frontend usa el ID
    group: int 
    FFgroup: str

class MedicationWithPriceAndStore(Medication):
    # Datos extra del detalle
    price: float
    store_name: str
    store_address: str
    store_telephone: str

# Request de Búsqueda
class MedicationSearchRequest(BaseModel):
    query: str
    per_page: int = 10

# Response de Lista
class MedicationsListResponse(BaseModel):
    results: List[Medication]

# Response de Detalle
class MedicationDetailResponse(BaseModel):
    # Aquí devolvemos la info del medicamento + la lista de tiendas
    medication: Medication
    stores: List[MedicationWithPriceAndStore]