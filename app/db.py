# app/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

def get_org_engine(org_db_name: str):
    db_url = f"sqlite:///./{org_db_name}.db"
    return create_engine(db_url, connect_args={"check_same_thread": False})

def get_org_session(org_db_name: str):
    engine = get_org_engine(org_db_name)
    Session = sessionmaker(bind=engine)
    return Session()
