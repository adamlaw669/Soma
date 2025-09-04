# app/schemas.py
from typing import Optional, List, Literal, Dict
from pydantic import BaseModel

# 🔹 Symptom keys (same as frontend)
SymptomKey = Literal[
    "fever",
    "headache",
    "nausea",
    "diarrhea",
    "body_pain",
    "cough",
    "chills",
    "fatigue",
    "sore_throat",
    "abdominal_pain",
    "rash",
    "duration_gt_3d",
]

# ----------------------
# Prediction API
# ----------------------

class Vitals(BaseModel):
    temperature_c: Optional[float] = None

class Demographics(BaseModel):
    age: Optional[int] = None
    sex: Optional[Literal["male", "female", "unspecified"]] = "unspecified"

class Meta(BaseModel):
    session_id: Optional[str] = None
    question_count: Optional[int] = None

class PredictRequest(BaseModel):
    symptoms: Dict[SymptomKey, bool]
    vitals: Optional[Vitals] = None
    demographics: Optional[Demographics] = None
    meta: Optional[Meta] = None

class DistributionItem(BaseModel):
    label: str
    probability: float

class TopPrediction(BaseModel):
    label: str
    probability: float

class PredictResponse(BaseModel):
    top_prediction: TopPrediction
    distribution: List[DistributionItem]
    triage: Literal["low", "medium", "high"]
    advice: List[str]
    explanations: Optional[List[str]] = None

# ----------------------
# Disease Info API
# ----------------------

class DiseaseInfo(BaseModel):
    name: str
    description: str
    commonSymptoms: List[str]
    treatment: List[str]
    prevention: List[str]
