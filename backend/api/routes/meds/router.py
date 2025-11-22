"""Medication router covering search and detail endpoints."""

from fastapi import APIRouter, Body, Header
from schemas.meds import *
from services.meds import MedService
router = APIRouter(tags=["medications"])

@router.post("/search", response_model=MedicationsListResponse)
def search_medications(payload: MedicationSearchRequest) -> MedicationsListResponse:
    return MedService.search_medications(payload)

@router.get("/{medication_id}", response_model=MedicationDetailResponse)
def get_medication_by_id(medication_id: str) -> MedicationDetailResponse:
    return MedService.get_medication_by_id(medication_id)