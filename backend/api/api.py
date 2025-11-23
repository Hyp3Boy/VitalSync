from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware


from api.routes.agent.router import router as agent_router
from api.routes.auth.router import router as auth_router
from api.routes.centers.router import router as centers_router
from api.routes.doctors.router import router as doctors_router
from api.routes.meds.router import router as meds_router


APP = FastAPI(title="VitalSync API", description="API for VitalSync application")

APP.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # o tu dominio exacto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_api():
    api = APIRouter(prefix="")

    #default route
    api.add_api_route("/", lambda: {"message": "OK."}, methods=["GET"])
    
    #routers
    api.include_router(auth_router)
    api.include_router(doctors_router)
    api.include_router(meds_router)
    api.include_router(centers_router)
    api.include_router(agent_router)
    APP.include_router(api)
    return APP