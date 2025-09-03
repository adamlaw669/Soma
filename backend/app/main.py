# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predict, diseases

app = FastAPI(
    title="Soma API",
    description="Backend for Soma –From symptoms to clarity — instantly.",
    version="1.0.0"
)

# CORS setup (allow frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(diseases.router, prefix="/diseases", tags=["Diseases"])

@app.get("/")
async def root():
    return {"message": "Welcome to Soma API"}
