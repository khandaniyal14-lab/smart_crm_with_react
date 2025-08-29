from pydantic import BaseModel

class OrganizationCreate(BaseModel):
    name: str
    plan_type: str = "free"

class OrganizationOut(BaseModel):
    id: int
    name: str
    plan_type: str

    class Config:
        orm_mode = True
