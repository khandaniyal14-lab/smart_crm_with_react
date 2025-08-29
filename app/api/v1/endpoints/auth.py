from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import string
import random

from app.schemas.user import UserCreate, UserLogin
from app.models.user import User, UserRole
from app.schemas.user import UserOut   # <-- import UserOut schema
from app.models.user import User       # <-- import User model
from app.api.v1.endpoints.deps import get_current_user ,require_roles
from app.models.database import get_db
from app.models.system import Organization  # main DB model
from app.db import get_org_session           # dynamic org DB session
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/auth", tags=["Auth"])




# FastAPI: app/api/v1/endpoints/auth.py
@router.get("/me", response_model=UserOut)  # UserOut is a Pydantic schema
def read_current_user(current_user: User = Depends(get_current_user)):
    return UserOut.from_orm(current_user)

def generate_temp_password(length: int = 10) -> str:
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(chars) for _ in range(length))

# ---------------------------
# Register a new user
# ---------------------------
@router.post("/register", response_model=dict)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["system_admin", "org_admin"]))
):
    """
    Register a new user in the system.
    - System Admin can create Org Admins
    - Org Admin can create Employees or Customers
    """
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Enforce role permissions
    if current_user.role == UserRole.ORG_ADMIN and user_data.role == "org_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Org Admin cannot create another Org Admin"
        )
    
    # Determine organization_id
    org_id = current_user.organization_id if current_user.role == UserRole.ORG_ADMIN else user_data.org_id
    org_id_str = str(org_id) if org_id is not None else None


    # Hash password
    hashed_password = get_password_hash(user_data.password)

    # Split name into first and last
    first_name, *last_name_parts = user_data.name.split(" ")
    last_name = " ".join(last_name_parts) if last_name_parts else ""
    temp_password = generate_temp_password()

# Hash the temporary password
    hashed_password = get_password_hash(temp_password)
    # Create new user
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=user_data.email,
        hashed_password=hashed_password,
        role=UserRole(user_data.role),
        organization_id=org_id_str,
        is_active=True,
        must_change_password=True
    )

    db.add(new_user)
    db.commit()
    NotificationService.send_temporary_password(
    email=new_user.email,
    temp_password=temp_password,
    first_name=new_user.first_name
    )
    db.refresh(new_user)
    new_user.role = UserRole(new_user.role)


    return {"message": "User created successfully", "user_id": str(new_user.id)}


# ---------------------------
# Login
# ---------------------------
@router.post("/login", response_model=dict)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )

    # Return token + user info
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": UserRole(user.role).value.lower().replace(" ", "_"),  # 'System Admin' -> 'system_admin'
            "organizationId": str(user.organization_id) if user.organization_id else None
         }

     }

@router.post("/org-login")
def org_login(org_name: str, email: str, password: str):
    # Get org DB name from main DB
    org = get_db.query(Organization).filter(Organization.name == org_name).first()
    if not org:
        raise HTTPException(404, "Organization not found")
    
    db = get_org_session(org.org_db_name)
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({"sub": user.id, "org_db": org.org_db_name})
    return {"access_token": token, "token_type": "bearer"}



