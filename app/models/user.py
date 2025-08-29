from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey, func
from sqlalchemy.orm import relationship
from .database import Base
from enum import Enum

class UserRole(str, Enum):
    SYSTEM_ADMIN = "system_admin"
    ORG_ADMIN = "org_admin"
    EMPLOYEE = "employee"
    CUSTOMER = "customer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "system_admin", "org_admin", "employee", etc.
    organization_id = Column(String(36), ForeignKey("organizations.id"))
    first_name = Column(String, nullable=True)   
    last_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)  # 1 for active, 0 for inactive
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    

    organization = relationship("Organization", back_populates="users")
    leads_assigned = relationship("Lead", back_populates="assigned_to")
    complaints_created = relationship("Complaint", back_populates="created_by", foreign_keys='Complaint.created_by_id')
    complaints_assigned = relationship("Complaint", back_populates="assigned_to", foreign_keys='Complaint.assigned_to_id')
    
    
