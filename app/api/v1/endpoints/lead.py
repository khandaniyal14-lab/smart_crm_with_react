from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadResponse
from app.api.v1.endpoints.deps import get_current_user
from app.models.database import get_db
from app.core.Tenant import tenant_filter


router = APIRouter(prefix="/leads", tags=["Leads"])

# ---------------------------
# Get all leads for current user's organization
# ---------------------------
# app/api/v1/endpoints/leads.py
@router.get("/", response_model=List[LeadResponse])
def get_leads(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = tenant_filter(db.query(Lead), Lead, current_user)
    leads = query.all()
    return leads

@router.post("/", response_model=LeadResponse)
def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_lead = Lead(
        name=lead_data.name,
        email=lead_data.email,
        phone=lead_data.phone,
        organization_id=current_user.organization_id,
        created_by=current_user.id
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead