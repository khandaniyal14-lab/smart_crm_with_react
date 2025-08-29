from pydantic import BaseModel
from datetime import datetime

class ComplaintBase(BaseModel):
    lead_id: int
    description: str

class ComplaintCreate(ComplaintBase):
    org_id: int

class ComplaintUpdate(BaseModel):
    description: str
    status: str

class ComplaintOut(ComplaintBase):
    id: int
    classification: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
