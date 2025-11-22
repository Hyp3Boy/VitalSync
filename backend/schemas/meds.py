from pydantic import BaseModel


class MedicationSearchRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    top_k: int = 10


class MedicationSummary(BaseModel):
    id: str
    name: str
    generic: bool
    description: str
    price: float
    pharmacy: str


class MedicationsListResponse(BaseModel):
    code: int
    data: list[MedicationSummary]


class MedicationDetail(BaseModel):
    id: str
    name: str
    generic: bool
    description: str
    price: float
    pharmacy: str
    ingredients: str
    side_effects: str
    usage: str
    dosage: str


class MedicationDetailResponse(BaseModel):
    code: int
    data: MedicationDetail
