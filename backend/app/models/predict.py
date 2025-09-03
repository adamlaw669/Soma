# app/models/predict.py
from pydantic import BaseModel
from typing import Dict, Optional, List, Literal

class PredictRequest(BaseModel):
    symptoms: Dict[str, bool]
    vitals: Optional[Dict[str, float]] = None
    demographics: Optional[Dict[str, str]] = None
    meta: Optional[Dict[str, str]] = None

class DistributionItem(BaseModel):
    label: str
    probability: float

class PredictResponse(BaseModel):
    top_prediction: DistributionItem
    distribution: List[DistributionItem]
    triage: Literal["low", "medium", "high"]
    advice: List[str]
    explanations: Optional[List[str]] = None
