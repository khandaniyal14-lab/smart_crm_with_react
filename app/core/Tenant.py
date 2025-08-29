from fastapi import Depends, HTTPException
from app.api.v1.endpoints.deps import get_current_user
from app.models.user import User

def get_tenant_organization(current_user: User = Depends(get_current_user)):
    if not current_user.organization_id:
        raise HTTPException(status_code=403, detail="No organization assigned")
    return current_user.organization_id

def tenant_filter(query, model, current_user: User = Depends(get_current_user)):
    return query.filter(model.organization_id == current_user.organization_id)
