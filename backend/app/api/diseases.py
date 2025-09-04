# app/api/diseases.py
from fastapi import APIRouter, Query
from typing import List
from app.schemas import DiseaseInfo

router = APIRouter()

@router.get("/", response_model=List[DiseaseInfo])
async def get_disease_info(labels: str = Query(..., description="Comma-separated labels")):
    label_list = [l.strip() for l in labels.split(",")]
    db = {
        "Malaria": DiseaseInfo(
            name="Malaria",
            description="A mosquito-borne disease...",
            commonSymptoms=["Fever", "Chills", "Headache"],
            treatment=["ACT", "Antimalarial drugs"],
            prevention=["Bed nets", "Mosquito control"]
        ),
        "Typhoid": DiseaseInfo(
            name="Typhoid",
            description="A bacterial infection...",
            commonSymptoms=["Fever", "Abdominal pain", "Headache"],
            treatment=["Antibiotics", "Hydration"],
            prevention=["Safe water", "Vaccination"]
        ),
        "Flu": DiseaseInfo(
            name= "Flu",
            description= "An infectious respiratory illness caused by influenza viruses.",
            commonSymptoms= ["Fever", "Cough", "Sore throat", "Body aches", "Fatigue"],
            treatment= ["Rest", "Fluids", "Antiviral drugs (in severe cases)"],
            prevention= ["Annual flu vaccination", "Hand hygiene", "Avoid close contact with sick people"]
        )

    }

    return [db[label] for label in labels if label in db]
