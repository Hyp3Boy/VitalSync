"""Health centers router covering search and detail endpoints."""

from fastapi import APIRouter, Body, Header
from schemas.centers import *
from services.centers import CenterService

router = APIRouter(prefix="/centers", tags=["health-centers"])


@router.post("/search", response_model=CentersListResponse)
def search_centers(payload: CenterSearchRequest) -> CentersListResponse:
    """Search health centers using placeholder data."""
    return CenterService.search_centers(payload)

@router.get("/{center_id}", response_model=CenterDetailResponse)
def get_center_by_id(center_id: str) -> CenterDetailResponse:
    """Retrieve health center data placeholder."""
    return CenterService.get_center_by_id(center_id)