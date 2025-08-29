from fastapi import FastAPI
from app.models.database import Base, engine
from app.api.v1.endpoints import auth, lead, complaint, user
from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart CRM MVP")

# CORS settings
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routers with prefix
app.include_router(auth.router, prefix="/api/v1/endpoints")
app.include_router(lead.router, prefix="/api/v1/endpoints/lead")
app.include_router(complaint.router, prefix="/api/v1/endpoints/complaint")
app.include_router(user.router)

@app.get("/")
def root():
    return {"message": "Smart CRM API is running 🚀"}
