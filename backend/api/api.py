from fastapi import FastAPI, APIRouter

from api.routes.auth.router import router as auth_router
from api.routes.centers.router import router as centers_router
from api.routes.doctors.router import router as doctors_router
from api.routes.meds.router import router as meds_router

APP = FastAPI(title="VitalSync API", description="API for VitalSync application")

def init_api():
    api = APIRouter(prefix="")

    #default route
    api.add_api_route("/", lambda: {"message": "OK."}, methods=["GET"])
    
    #routers
    api.include_router(auth_router)
    api.include_router(doctors_router)
    api.include_router(meds_router)
    api.include_router(centers_router)
    APP.include_router(api)
    return APP