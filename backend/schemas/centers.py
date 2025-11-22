from pydantic import BaseModel


class LocationFilter(BaseModel):
    latitude: float
    longitude: float


class CenterSearchRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    location: LocationFilter | None = None
    top_k: int = 10


class CenterSummary(BaseModel):
    id: str
    name: str
    location: str


class CentersListResponse(BaseModel):
    code: int
    data: list[CenterSummary]


class CenterDetail(BaseModel):
    id: str
    name: str
    location: str
    services_offered: str
    contact_info: str


class CenterDetailResponse(BaseModel):
    code: int
    data: CenterDetail
