# app/models/organization.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    # Must match Lead.organization's back_populates
    users = relationship("User", back_populates="organization", cascade="all, delete")
    employees = relationship("Employee", back_populates="organization", cascade="all, delete")  # optional duplicate if employees are Users
    customers = relationship("Customer", back_populates="organization", cascade="all, delete")
    leads = relationship("Lead", back_populates="organization", cascade="all, delete")
    complaints = relationship("Complaint", back_populates="organization", cascade="all, delete")