from schemas.auth import *

class AuthService:
    @staticmethod
    def login(payload: LoginRequest) -> TokenResponse:
        """Authenticate a user and return a fake token placeholder."""
        expires_in_seconds = 60 * 60  # 1 hour placeholder
        fake_token = "demo-jwt-token"
        return TokenResponse(token=fake_token, expiresIn=expires_in_seconds)

    @staticmethod
    def register(payload : RegisterRequest):
        """Create a new user account placeholder."""
        fake_user_id = 1
        return RegisterResponse(status="User created", id=fake_user_id)
    
    @staticmethod
    def me(authorization : str):
        """Return profile data for the token holder placeholder."""
        return CurrentUserResponse(id="user-1", email="user@example.com", role="admin")
    