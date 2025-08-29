# seed_organization.py
from app.models.database import SessionLocal
from app.models.organization import Organization
import uuid
from datetime import datetime

db = SessionLocal()

org = Organization(
    id=uuid.uuid4(),
    name="My Company",
    domain="mycompany.com",   # <--- add this!
    subscription_tier="FREE",
    is_active=True,
    created_at=datetime.utcnow()
)

db.add(org)
db.commit()
db.close()
print("Organization seeded successfully ✅")

