from pydantic import BaseModel


class Medication(BaseModel):
    comp_name: str              # nombre_comp
    name: str                   # nombreProducto
    concentration: str          # concent
    pharmaceutical_form: str    # nombreFormaFarmaceutica
    group: int                  # grupo
    FFgroup: str                # codGrupoFF

class MedicationWithPriceAndStore(Medication):
    # nombreProducto
    # concent
    # nomGrupoFF -> nombreFormaFarmaceutica
    # grupo
    # codGrupoFF
    medication_code: int    # codProdE
    price: float            # precio2
    store_code: str          # codEstab
    store_address: str       # direccion
    store_telephone: str     # telefono
    store_name: str          # nombreComercial
    