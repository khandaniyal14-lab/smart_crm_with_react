from pydantic import BaseModel, validator
from uuid import UUID
from datetime import datetime
from app.models.user import UserRole
from typing import Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    organization_id: str
    is_active: bool
    @validator("role")
    def uppercase_role(cls, v):
        return v.upper()


class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: Optional[str] = None            # ✅ allow missing name
    organization_id: Optional[int] = None
    email: str
    role: str
    
    class Config:
        orm_mode = True

class UserRead(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    role: UserRole
    organization_id: UUID | None
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    role: str | None = None
    organization_id: str | None = None
    is_active: bool | None = None