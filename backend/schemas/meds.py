from pydantic import BaseModel


class MedicationSearchRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    top_k: int = 10


class MedicationSummary(BaseModel):
    id: str
    name: str
    description: str


class MedicationsListResponse(BaseModel):
    code: int
    data: list[MedicationSummary]


class MedicationDetail(BaseModel):
    id: str
    name: str
    description: str
    ingredients: str
    side_effects: str
    usage: str
    dosage: str


class MedicationDetailResponse(BaseModel):
    code: int
    data: MedicationDetail
