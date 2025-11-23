"""Health centers router covering search and detail endpoints."""

from fastapi import APIRouter, Body, Header
from schemas.centers import *
from services.centers import CenterService

router = APIRouter(prefix="/centers", tags=["health-centers"])


@router.post("/search", response_model=HealthCentersQueryResult)
def search_centers(payload: HealthCenterQuery) -> HealthCentersQueryResult:
    """Search health centers using placeholder data."""
    return CenterService.search_centers(payload)

@router.get("/about", response_model=HealthCenter)
def get_center_by_id(payload: IdHealthCenter) -> HealthCenter:
    """Retrieve health center data placeholder."""
    return CenterService.get_center_by_id(payload)