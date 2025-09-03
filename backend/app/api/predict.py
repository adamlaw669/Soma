# app/api/predict.py
from fastapi import APIRouter
from app.models.predict import PredictRequest, PredictResponse
from app.services.predictor import predict_disease

router = APIRouter()

@router.post("/", response_model=PredictResponse)
async def make_prediction(request: PredictRequest):
    return predict_disease(request)
