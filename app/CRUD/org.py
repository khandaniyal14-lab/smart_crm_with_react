# app/crud/org.py
from app.models.org import User
from app.utils import hash_password

def create_org_user(org_db_name: str, email: str, password: str, role: str):
    db = get_org_session(org_db_name)
    user = User(
        email=email,
        hashed_password=hash_password(password),
        role=role
    )
    db.add(user)
    db.commit()
    db.close()
    return user
