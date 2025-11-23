from pydantic import BaseModel


# BASE MODELS
class HealthCenter(BaseModel):
    id : str
    name : str
    ubication : list[float]  # [latitude, longitude]
    specialties : list[str]
    category : str
    ubigeo : str

class HealthCenterQuery(BaseModel):
    name: str | None = None
    description: str | None = None
    location: list[float] | None = None
    max_radius: int | None = 10
    
class HealthCentersQueryResult(BaseModel):
    centers: list[HealthCenter] = []
    
class IdHealthCenter(BaseModel):
    id: str