from pydantic import BaseModel

class DoctorSearchRequest(BaseModel):
    id: str | None = None
    specialty: str | None = None
    name: str | None = None
    description: str | None = None
    top_k: int = 10

class DoctorSummary(BaseModel):
    id: str
    name: str
    specialty: str
    location: str

class DoctorsListResponse(BaseModel):
    code: int
    data: list[DoctorSummary]

class DoctorDetail(BaseModel):
    id: str
    name: str
    specialty: str
    location: str
    bio: str
    contact_info: str

class DoctorDetailResponse(BaseModel):
    code: int
    data: DoctorDetail
    
class DoctorCommentRequest(BaseModel):
    doctor_id: str
    user_id: str
    rating: int
    comment: str
    
class DoctorCommentResponse(BaseModel):
    code: int
    message: str
    
class DoctorCommentListResponse(BaseModel):
    doctor_id: str
    comments: list[DoctorCommentRequest]