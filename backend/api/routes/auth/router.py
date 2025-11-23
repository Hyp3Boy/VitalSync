"""Authentication API router."""

from fastapi import APIRouter, Header
from schemas.auth import *
from services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login_user(payload: LoginRequest) -> TokenResponse:
    """Authenticate a user and return a fake token placeholder."""
    return AuthService.login(payload)


@router.post("/register", status_code=201, response_model=RegisterResponse)
async def register_user(payload: RegisterRequest) -> RegisterResponse:
    """Create a new user account placeholder."""
    return AuthService.register(payload)


@router.get("/me", response_model=CurrentUserResponse)
async def get_current_user(
    authorization: str = Header(..., alias="Authorization")
) -> CurrentUserResponse:
    """Return profile data for the token holder placeholder."""
    return AuthService.me(authorization)
