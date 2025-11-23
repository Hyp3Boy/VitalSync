from schemas.doctors import *
from difflib import SequenceMatcher


class DoctorService:
    
    @staticmethod
    def _similarity(a: str, b: str) -> float:
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()

    @staticmethod
    def search_doctors(payload: DoctorSearchRequest) -> DoctorsListResponse:
        name_query = payload.name_query
        speciality = payload.speciality
        top_k = payload.top_k
        top_items = []
        
        return DoctorsListResponse(items=top_items)

    @staticmethod
    def get_doctor_by_id(doctor_id: str) -> DoctorDetailResponse:
        # Placeholder implementation for retrieving a doctor's details
        return DoctorDetailResponse(doctor_id=doctor_id, name="Dr. Placeholder", specialty="General")
    
    @staticmethod
    def add_comment(payload: DoctorCommentRequest) -> DoctorCommentResponse:
        # Placeholder implementation for adding a comment
        return DoctorCommentResponse(code=200, message="Comment added successfully") 