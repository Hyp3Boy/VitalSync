"""Doctors router covering search and detail endpoints."""

from fastapi import APIRouter, Body, Header
from schemas.doctors import *
from services.doctors import DoctorService

router = APIRouter(tags=["doctors"])

@router.post("/search", response_model=DoctorsListResponse)
def search_doctors(payload: DoctorSearchRequest) -> DoctorsListResponse:
    return DoctorService.search_doctors(payload)


@router.get("/{doctor_id}", response_model=DoctorDetailResponse)
def get_doctor_by_id(doctor_id: str) -> DoctorDetailResponse:
    return DoctorService.get_doctor_by_id(doctor_id)
