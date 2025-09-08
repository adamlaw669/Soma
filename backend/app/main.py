from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api import predict, diseases
from app.api import doctor
from app.api import report
from app.api import diagnoses
from app.services.predictor import Predictor
cursor/generate-downloadable-patient-diagnosis-reports-1180
from app.config import MODEL_PATH
from app.db import Base, engine

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Soma API",
    description="Backend for Soma –From symptoms to clarity — instantly.",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


import os

# Security: Configure CORS based on environment
allowed_origins = [
    "http://localhost:3000",  # Development frontend
    "https://soma-health.vercel.app",  # Production frontend
]

# Allow additional origins from environment variable
if "ALLOWED_ORIGINS" in os.environ:
    additional_origins = os.environ["ALLOWED_ORIGINS"].split(",")
    allowed_origins.extend([origin.strip() for origin in additional_origins])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "x-role"],
)

# Routers
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(diseases.router, prefix="/diseases", tags=["Diseases"])
app.include_router(diagnoses.router, prefix="/diagnoses", tags=["Diagnoses"])
app.include_router(doctor.router, prefix="/doctor", tags=["Doctor"])
app.include_router(report.router, prefix="/reports", tags=["Reports"])

@app.on_event("startup")
async def load_predictor():
    # Ensure DB tables exist irrespective of model loading outcome
    Base.metadata.create_all(bind=engine)
    # path should match where you placed the joblib artifact
    try:

        app.state.predictor = Predictor(MODEL_PATH)
        print(f"Predictor loaded successfully from: {MODEL_PATH}")
    except Exception as e:
        # keep the app up but warn; your /predict will return 503 until loaded
        print(f"Failed to load predictor on startup from {MODEL_PATH}:", e)
        app.state.predictor = None

@app.get("/")
async def root():
    return {"message": "Welcome to Soma API"}