async def generate_dashboard_stats(db: Session, current_user: User):
    if current_user.role == "system_admin":
        total_leads = db.query(Lead).count()
    else:
        total_leads = db.query(Lead).filter(Lead.organization_id == current_user.organization_id).count()
    return {"total_leads": total_leads}
