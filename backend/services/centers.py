from schemas.centers import *

class CenterService:
    @staticmethod
    def search_centers(payload: CenterSearchRequest) -> CentersListResponse:
        """Search health centers using placeholder data."""
        # return placeholder data
        return CentersListResponse(
            centers=[
                CenterSummary(
                    id="center_1",
                    name="Health Center One",
                    address="123 Main St, Cityville",
                    phone="123-456-7890",
                ),
                CenterSummary(
                    id="center_2",
                    name="Health Center Two",
                    address="456 Side St, Townsville",
                    phone="987-654-3210",
                ),
            ],
            code=200,
        )

    @staticmethod
    def get_center_by_id(center_id: str) -> CenterDetailResponse:
        """Retrieve health center data placeholder."""
        # return placeholder data
        return CenterDetailResponse(
            center=CenterDetail(
                id=center_id,
                name="Health Center One",
                address="123 Main St, Cityville",
                phone="123-456-7890",
                services=["General Practice", "Pediatrics", "Emergency"],
                operating_hours="Mon-Fri 8am-8pm, Sat-Sun 9am-5pm",
            ),
            code=200,
        )
