from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Lead(Base):
    __tablename__ = "leads"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # optional employee assignment
    status = Column(String, default="new")  # e.g., new, contacted, converted, closed
    lead_score = Column(Integer, default=0)  # optional AI scoring
    category = Column(String, nullable=True)  # e.g., hot, warm, cold
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="leads")
    assigned_to = relationship("User", back_populates="leads_assigned")
   
