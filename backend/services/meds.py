from schemas.meds import *

class MedService:
    @staticmethod
    def search_medications(payload: MedicationSearchRequest) -> MedicationsListResponse:
        # Implement the logic to search medications based on the payload
        pass

    @staticmethod
    def get_medication_by_id(medication_id: str) -> MedicationDetailResponse:
        # Implement the logic to get medication details by ID
        pass