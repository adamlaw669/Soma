# app/api/predict.py
from fastapi import APIRouter
from app.schemas import PredictRequest, PredictResponse, DistributionItem, TopPrediction

router = APIRouter()

@router.post("/", response_model=PredictResponse)
async def predict_disease(request: PredictRequest):
    # mock prediction
    top_pred = TopPrediction(label="Malaria", probability=0.8)
    distribution = [
        DistributionItem(label="Malaria", probability=0.8),
        DistributionItem(label="Typhoid", probability=0.15),
        DistributionItem(label="Flu", probability=0.05),
    ]
    return PredictResponse(
        top_prediction=top_pred,
        distribution=distribution,
        triage="medium",
        advice=[
            "Drink plenty of fluids",
            "Rest well",
            "Consult a doctor if symptoms persist"
        ]
    )
