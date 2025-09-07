from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predict, diseases
from app.api import doctor
from app.api import report
from app.api import diagnoses
from app.services.predictor import Predictor
from app.db import Base, engine

app = FastAPI(
    title="Soma API",
    description="Backend for Soma –From symptoms to clarity — instantly.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(diseases.router, prefix="/diseases", tags=["Diseases"])
app.include_router(diagnoses.router, prefix="/diagnoses", tags=["Diagnoses"])
app.include_router(doctor.router, prefix="/doctor", tags=["Doctor"])
app.include_router(report.router, prefix="/report", tags=["Report"])

@app.on_event("startup")
async def load_predictor():
    # Ensure DB tables exist irrespective of model loading outcome
    Base.metadata.create_all(bind=engine)
    # path should match where you placed the joblib artifact
    try:
        app.state.predictor = Predictor("/workspace/backend/app/models/soma_model_v1.joblib")
        print("Predictor loaded successfully.")
    except Exception as e:
        # keep the app up but warn; your /predict will return 503 until loaded
        print("Failed to load predictor on startup:", e)
        app.state.predictor = None

@app.get("/")
async def root():
    return {"message": "Welcome to Soma API"}