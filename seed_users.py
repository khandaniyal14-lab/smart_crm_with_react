from app.models.database import SessionLocal
from app.models.user import User, UserRole
from app.models.organization import Organization
import uuid
from datetime import datetime
from passlib.hash import bcrypt

db = SessionLocal()

# Fetch the organization we just seeded
org = db.query(Organization).filter_by(name="My Company").first()

users = [
    User(
        id=uuid.uuid4(),
        email="sysadmin@crm.com",
        hashed_password=bcrypt.hash("password123"),
        first_name="System",
        last_name="Admin",
        role=UserRole.SYSTEM_ADMIN,
        organization_id=None,  # system admin may not belong to an org
        is_active=True,
        created_at=datetime.utcnow()
    ),
    User(
        id=uuid.uuid4(),
        email="orgadmin@company.com",
        hashed_password=bcrypt.hash("password123"),
        first_name="Org",
        last_name="Admin",
        role=UserRole.ORG_ADMIN,
        organization_id=org.id,
        is_active=True,
        created_at=datetime.utcnow()
    ),
    User(
        id=uuid.uuid4(),
        email="employee@company.com",
        hashed_password=bcrypt.hash("password123"),
        first_name="Employee",
        last_name="User",
        role=UserRole.EMPLOYEE,
        organization_id=org.id,
        is_active=True,
        created_at=datetime.utcnow()
    ),
    User(
        id=uuid.uuid4(),
        email="customer@gmail.com",
        hashed_password=bcrypt.hash("password123"),
        first_name="Customer",
        last_name="User",
        role=UserRole.CUSTOMER,
        organization_id=None,  # may not belong to org
        is_active=True,
        created_at=datetime.utcnow()
    ),
]

db.add_all(users)
db.commit()
db.close()
print("Users seeded successfully ✅")
