from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.models.database import get_db
from passlib.context import CryptContext
import uuid

router = APIRouter(prefix="/users", tags=["Users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_pwd = get_password_hash(user.password)
    try:
        org_id = str(uuid.UUID(user.organization_id)) if user.organization_id else None
    except ValueError:
        # If invalid, generate a new UUID automatically
        org_id = uuid.uuid4()
    
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role,
        organization_id= org_id,
        hashed_password=hashed_pwd,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: str, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user.dict(exclude_unset=True)
    
    # Hash password if it is being updated
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

