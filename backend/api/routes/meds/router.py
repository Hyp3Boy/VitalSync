"""Medication router covering search and detail endpoints."""

from fastapi import APIRouter
from schemas.meds import *
from services.meds import MedService
router = APIRouter(prefix="/meds",tags=["medications"])

@router.post("/search", response_model=MedicationsListResponse)
def search_medications(payload: MedicationSearchRequest):
    # Devuelve lista de medicamentos, CADA UNO CON SU ID generado
    return MedService.search_medications(payload)

@router.get("/about/{medication_id}", response_model=MedicationDetailResponse)
def get_medication_by_id(medication_id: str):
    # Recibe el ID, lo procesa internamente y devuelve los detalles
    return MedService.get_medication_by_id(medication_id)