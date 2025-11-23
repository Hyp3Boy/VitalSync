from pydantic import BaseModel


class DoctorSearchRequest(BaseModel):
    name_query: str | None = None
    speciality: str | None = None
    top_k: int = 10


class DoctorSummary(BaseModel):
    id: str
    name: str
    speciality: str
    rating: int
    workplace: str
    workplace_insurance: str


class DoctorsListResponse(BaseModel):
    code: int
    data: list[DoctorSummary]


class DoctorScheduleBlock(BaseModel):
    day: str
    start_time: str
    end_time: str


class DoctorDetail(BaseModel):
    id: str
    name: str
    speciality: str
    rating: int
    workplace: str
    workplace_insurance: str
    bio: str
    contact_info: str
    schedule: list[DoctorScheduleBlock]


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
