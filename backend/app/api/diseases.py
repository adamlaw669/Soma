# app/api/diseases.py
from fastapi import APIRouter, Query
from typing import List
from app.schemas import DiseaseInfo

router = APIRouter()

@router.get("/", response_model=List[DiseaseInfo])
async def get_disease_info(labels: str = Query(..., description="Comma-separated labels")):
    label_list = [l.strip() for l in labels.split(",")]
    db = {
    "Asthma": DiseaseInfo(
        name="Asthma",
        description="A chronic respiratory condition characterized by inflammation and narrowing of the airways, leading to difficulty breathing.",
        commonSymptoms=["Shortness of breath", "Wheezing", "Coughing (especially at night or early morning)", "Chest tightness"],
        treatment=["Inhaled corticosteroids (preventive)", "Bronchodilators (quick-relief inhalers)", "Oral medications"],
        prevention=["Avoiding triggers (e.g., pollen, dust mites)", "Staying active", "Maintaining a healthy weight", "Getting an annual flu vaccine"]
    ),
    "Common Cold": DiseaseInfo(
        name="Common Cold",
        description="A viral infection of the nose and throat, typically harmless and self-recovering.",
        commonSymptoms=["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Sneezing", "Body aches"],
        treatment=["Rest", "Fluids", "Over-the-counter pain relievers", "Saline nasal spray"],
        prevention=["Washing hands frequently", "Avoiding touching the face", "Avoiding close contact with sick people"]
    ),
    "Diabetes": DiseaseInfo(
        name="Diabetes",
        description="A chronic condition that affects how your body turns food into energy. It is characterized by high blood sugar levels.",
        commonSymptoms=["Frequent urination", "Increased thirst", "Unexplained weight loss", "Blurry vision", "Fatigue"],
        treatment=["Insulin therapy (for Type 1)", "Oral medications (for Type 2)", "Diet and exercise", "Blood sugar monitoring"],
        prevention=["Maintaining a healthy weight", "Eating a balanced diet", "Regular physical activity"]
    ),
    "Flu": DiseaseInfo(
        name="Flu",
        description="An infectious respiratory illness caused by influenza viruses. Symptoms are often more severe than a common cold.",
        commonSymptoms=["Fever", "Cough", "Sore throat", "Body aches", "Fatigue"],
        treatment=["Rest", "Fluids", "Antiviral drugs (in severe cases)"],
        prevention=["Annual flu vaccination", "Hand hygiene", "Avoiding close contact with sick people"]
    ),
    "Heat Stroke": DiseaseInfo(
        name="Heat Stroke",
        description="A serious medical emergency that occurs when the body's temperature regulation system fails, causing the core body temperature to rise to dangerous levels.",
        commonSymptoms=["High body temperature (>104°F/40°C)", "Absence of sweating", "Dizziness", "Confusion", "Nausea or vomiting", "Rapid, shallow breathing"],
        treatment=["Emergency medical care", "Cooling the body rapidly (e.g., ice packs, cool bath)", "Rehydration"],
        prevention=["Drinking plenty of fluids", "Wearing loose-fitting, light-colored clothing", "Avoiding strenuous activity during the hottest parts of the day"]
    ),
    "Malaria": DiseaseInfo(
        name="Malaria",
        description="A serious disease caused by a parasite that is transmitted to humans through the bites of infected mosquitoes.",
        commonSymptoms=["Fever", "Chills", "Headache", "Sweating", "Fatigue"],
        treatment=["Antimalarial drugs (e.g., Artemisinin-based combination therapies)"],
        prevention=["Using insecticide-treated bed nets", "Wearing protective clothing", "Antimalarial medication for travelers"]
    ),
    "Migraine": DiseaseInfo(
        name="Migraine",
        description="A neurological condition that often causes a severe throbbing headache, typically on one side of the head, accompanied by other symptoms.",
        commonSymptoms=["Intense headache (often throbbing)", "Nausea", "Vomiting", "Sensitivity to light and sound"],
        treatment=["Pain-relieving medications (over-the-counter or prescription)", "Preventive medications", "Stress management", "Acupuncture"],
        prevention=["Identifying and avoiding triggers (e.g., certain foods, stress)", "Regular exercise", "Maintaining a consistent sleep schedule"]
    ),
    "Premenstrual Tension Syndrome": DiseaseInfo(
        name="Premenstrual Tension Syndrome",
        description="A combination of physical and emotional symptoms that occur in the days leading up to a woman's menstrual period.",
        commonSymptoms=["Mood swings", "Irritability", "Bloating", "Fatigue", "Breast tenderness", "Headaches"],
        treatment=["Lifestyle adjustments (e.g., exercise, stress reduction)", "Over-the-counter pain relievers", "Hormonal birth control"],
        prevention=["Regular exercise", "Eating a healthy diet", "Reducing caffeine and alcohol intake"]
    ),
    "Primary Insomnia": DiseaseInfo(
        name="Primary Insomnia",
        description="A sleep disorder characterized by difficulty falling or staying asleep, leading to non-restorative sleep, without an identifiable underlying cause.",
        commonSymptoms=["Difficulty falling asleep", "Waking up frequently during the night", "Waking up too early", "Not feeling rested after sleep"],
        treatment=["Cognitive Behavioral Therapy for Insomnia (CBT-I)", "Sleep hygiene practices", "Medications (short-term)"],
        prevention=["Maintaining a consistent sleep schedule", "Creating a relaxing bedtime routine", "Avoiding caffeine and alcohol before bed"]
    ),
    "Strep Throat": DiseaseInfo(
        name="Strep Throat",
        description="A bacterial infection that can cause a sore, scratchy throat. It is caused by Streptococcus bacteria.",
        commonSymptoms=["Sudden sore throat", "Pain when swallowing", "Fever", "Tiny red spots on the roof of the mouth", "Swollen lymph nodes in the neck"],
        treatment=["Antibiotics (to prevent complications)", "Pain relievers", "Gargling with salt water"],
        prevention=["Washing hands often", "Avoiding sharing food or drinks with infected people", "Covering coughs and sneezes"]
    )
}

    return [db[label] for label in labels if label in db]
