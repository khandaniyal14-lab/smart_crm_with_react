from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="open")  # e.g., open, in_progress, closed
    priority = Column(String, default="medium")  # e.g., low, medium, high
    type = Column(String, nullable=True)  # e.g., billing, technical, general
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # who created the complaint
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # optional employee assignment
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="complaints")
    created_by = relationship("User", back_populates="complaints_created", foreign_keys=[created_by_id])
    assigned_to = relationship("User", back_populates="complaints_assigned", foreign_keys=[assigned_to_id])