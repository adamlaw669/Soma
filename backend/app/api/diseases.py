# app/api/diseases.py
from fastapi import APIRouter
from typing import List

router = APIRouter()

MOCK_DISEASES = {
    "Malaria": {"summary": "Caused by parasites via mosquito bites.", "common_symptoms": ["fever", "chills", "headache"]},
    "Typhoid": {"summary": "Bacterial infection from contaminated food/water.", "common_symptoms": ["abdominal pain", "diarrhea", "fever"]},
    "Flu": {"summary": "Viral respiratory infection.", "common_symptoms": ["cough", "sore throat", "fatigue"]}
}

@router.get("/")
async def get_diseases(labels: str):
    selected = labels.split(",")
    return {label: MOCK_DISEASES.get(label, {}) for label in selected}
