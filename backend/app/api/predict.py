# app/api/predict.py
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.schemas import PredictRequest, PredictResponse, DistributionItem, TopPrediction
from app.db import get_db
from app.models.diagnosis import DiagnosisCreate
from app.services.diagnosis_service import create_diagnosis

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/", response_model=PredictResponse)
# @limiter.limit("10/minute")  # Temporarily disabled for debugging
async def predict_endpoint(req: PredictRequest, request: Request, db: Session = Depends(get_db)):
    predictor = getattr(request.app.state, "predictor", None)
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Try again later.")
    try:
        result = predictor.predict(req)

        # Persist diagnosis
        top_label = result["top_prediction"]["label"] if isinstance(result["top_prediction"], dict) else result["top_prediction"].label
        distribution_list = result["distribution"]

        diagnosis_payload = DiagnosisCreate(
            user_id=(req.meta.session_id if req.meta and getattr(req.meta, "session_id", None) else "anonymous"),
            symptoms=req.symptoms,
            vitals=(req.vitals.dict() if req.vitals else None),
            demographics=(req.demographics.dict() if req.demographics else None),
            top_prediction=top_label,
            distribution=distribution_list,
        )
        try:
            create_diagnosis(db, diagnosis_payload)
        except Exception:
            # Do not block the response if persistence fails
            pass

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))