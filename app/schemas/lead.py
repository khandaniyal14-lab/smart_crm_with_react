from pydantic import BaseModel
from datetime import datetime

from datetime import datetime
from pydantic import BaseModel

class LeadBase(BaseModel):
    name: str
    email: str
    phone: str

class LeadCreate(LeadBase):
    org_id: int

class LeadUpdate(LeadBase):
    pass

class LeadOut(LeadBase):
    id: int
    score: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# LeadResponse can include all LeadOut fields plus optional related data
class LeadResponse(LeadOut):
    organization_name: str | None = None  # Example extra field
    lead_source: str | None = None        # Example extra field
