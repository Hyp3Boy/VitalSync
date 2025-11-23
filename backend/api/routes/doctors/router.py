"""Doctors router covering search and detail endpoints."""

from fastapi import APIRouter, Body, Header
from schemas.doctors import *
from services.doctors import DoctorService

router = APIRouter(prefix="/doctors", tags=["doctors"])

@router.post("/search", response_model=DoctorQueryResult)
def search_doctors(payload : DoctorQuery) -> DoctorQueryResult:
    return DoctorService.search_doctors(payload)

@router.get("/about", response_model=Doctor)
def get_doctor_by_id(doctor_id: IdDoctorQuery) -> Doctor:
    return DoctorService.get_doctor_by_id(doctor_id)


@router.put("/comment")
def add_comment(payload: CommentRequest) -> str:
    return DoctorService.add_comment(payload)

@router.get("/comment")
def get_comments(payload: IdDoctorQuery) -> CommentResult:
    return DoctorService.get_comments(payload)