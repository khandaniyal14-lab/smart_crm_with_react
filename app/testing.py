from app.models.database import engine, Base
from app.models.user import User

Base.metadata.create_all(bind=engine)  # Should create tables in your DB
print("Database tables created successfully!")
