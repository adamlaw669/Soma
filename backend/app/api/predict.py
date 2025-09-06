# app/api/predict.py
from fastapi import APIRouter, Request, HTTPException
from app.schemas import PredictRequest, PredictResponse, DistributionItem, TopPrediction

router = APIRouter()

@router.post("/", response_model=PredictResponse)
async def predict_endpoint(req: PredictRequest, request: Request):
    predictor = getattr(request.app.state, "predictor", None)
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Try again later.")
    try:
        result = predictor.predict(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))