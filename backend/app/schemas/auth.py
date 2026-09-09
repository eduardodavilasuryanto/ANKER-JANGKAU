from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime | None = None


class SessionResponse(BaseModel):
    token: str
    user: UserResponse


class SavedSearchCreateRequest(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
    search_input: dict[str, Any]
    search_result: dict[str, Any]


class SavedSearchResponse(SavedSearchCreateRequest):
    id: str
    created_at: datetime
    updated_at: datetime
