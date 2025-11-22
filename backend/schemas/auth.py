from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    token: str
    expiresIn: int


class RegisterRequest(BaseModel):
    username: str
    password: str


class RegisterResponse(BaseModel):
    status: str
    id: int


class CurrentUserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
