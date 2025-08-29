from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintOut
from app.models.user import User
from app.api.v1.endpoints.deps import require_roles, get_current_user
from app.services.AI_service import AIService

router = APIRouter(prefix="/complaints", tags=["Complaints"])


# ---- AI Classification ----
@router.get("/classify/{complaint_id}")
async def classify_complaint_endpoint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["org_admin", "employee"]))
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id,
        Complaint.organization_id == current_user.organization_id
    ).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    ai_service = AIService()
    classification = await ai_service.classify_complaint(complaint.description)

    # Example priority logic
    complaint.priority = "high" if classification == "technical" else "normal"
    complaint.classification = classification

    db.commit()
    db.refresh(complaint)

    return ComplaintOut.from_orm(complaint)


# ---- Create Complaint ----
@router.post("/", response_model=ComplaintOut)
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["org_admin", "employee"]))
):
    new_complaint = Complaint(
        **complaint.dict(),
        organization_id=current_user.organization_id,
        created_by=current_user.id
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return ComplaintOut.from_orm(new_complaint)


# ---- Read All Complaints ----
@router.get("/", response_model=List[ComplaintOut])
def get_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["org_admin", "employee"]))
):
    complaints = db.query(Complaint).filter(
        Complaint.organization_id == current_user.organization_id
    ).all()
    return [ComplaintOut.from_orm(c) for c in complaints]


# ---- Read Complaint by ID ----
@router.get("/{complaint_id}", response_model=ComplaintOut)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["org_admin", "employee", "customer"]))
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id,
        Complaint.organization_id == current_user.organization_id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return ComplaintOut.from_orm(complaint)


# ---- Update Complaint ----
@router.put("/{complaint_id}", response_model=ComplaintOut)
def update_complaint(
    complaint_id: int,
    complaint_data: ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["org_admin", "employee"]))
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id,
        Complaint.organization_id == current_user.organization_id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    for key, value in complaint_data.dict(exclude_unset=True).items():
        setattr(complaint, key, value)

    db.commit()
    db.refresh(complaint)
    return ComplaintOut.from_orm(complaint)


# ---- Delete Complaint ----
@router.delete("/{complaint_id}")
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["org_admin"]))
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id,
        Complaint.organization_id == current_user.organization_id
    ).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted"}
