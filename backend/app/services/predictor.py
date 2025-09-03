# app/services/predictor.py
import random
from app.models.predict import PredictRequest, PredictResponse, DistributionItem

def predict_disease(request: PredictRequest) -> PredictResponse:
    # Mock logic for now
    diseases = ["Malaria", "Typhoid", "Flu"]
    probs = [0.6, 0.3, 0.1]
    distribution = [DistributionItem(label=d, probability=p) for d, p in zip(diseases, probs)]

    return PredictResponse(
        top_prediction=distribution[0],
        distribution=distribution,
        triage="medium",
        advice=[
            "Consult a healthcare professional.",
            "Stay hydrated and rest.",
            "Avoid self-medication."
        ],
        explanations=["Mocked response, real model coming soon."]
    )
