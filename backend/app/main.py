import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.api import predict, diseases, doctor, report, diagnoses
from app.services.predictor import Predictor
from app.config import MODEL_PATH
from app.db import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        app.state.predictor = Predictor(MODEL_PATH)
        print(f"Predictor loaded successfully from: {MODEL_PATH}")
    except Exception as e:
        print(f"Failed to load predictor on startup from {MODEL_PATH}:", e)
        app.state.predictor = None
    yield


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Soma API",
    description="Backend for Soma – From symptoms to clarity — instantly.",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins = [
    "http://localhost:3000",
    "https://somahealth.vercel.app",
]

if "ALLOWED_ORIGINS" in os.environ:
    additional_origins = os.environ["ALLOWED_ORIGINS"].split(",")
    allowed_origins.extend([origin.strip() for origin in additional_origins])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(diseases.router, prefix="/diseases", tags=["Diseases"])
app.include_router(diagnoses.router, prefix="/diagnoses", tags=["Diagnoses"])
app.include_router(doctor.router, prefix="/doctor", tags=["Doctor"])
app.include_router(report.router, prefix="/reports", tags=["Reports"])


@app.get("/")
async def root():
    return {"message": "Welcome to Soma API"}


@app.options("/predict")
async def predict_options():
    return {"message": "OK"}


@app.options("/diagnoses/{user_id}")
async def diagnoses_options(user_id: str):
    return {"message": "OK"}


@app.post("/predict")
async def predict_redirect():
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/predict/", status_code=307)
