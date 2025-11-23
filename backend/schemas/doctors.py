from pydantic import BaseModel

# BASE MODELS
class Doctor(BaseModel):
    id: str
    cmp: str
    status: str
    name: str
    specialties: list[str]
    n_comments: int
    sc_acum: float


class Comment(BaseModel):
    doctor_id: str
    user_id: str
    rating: float
    content: str
    timestamp: str

# ROUTE MODELS


class IdDoctorQuery(BaseModel):
    id: str
    
class DoctorQuery(BaseModel):
    name: str | None = None
    specialty: str | None = None
    top_k: int | None = 10 

class DoctorQueryResult(BaseModel):
    results: list[Doctor] = []

class CommentRequest(BaseModel):
    doctor_id: str
    user_id: str
    rating: float
    content: str

class CommentResult(BaseModel):
    comments: list[Comment] = []
