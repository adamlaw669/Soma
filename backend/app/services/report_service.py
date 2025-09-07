from datetime import datetime
from typing import Dict, Any

from app.models.diagnosis import Diagnosis


DISCLAIMER = (
    "This report is generated to assist understanding and is not a medical diagnosis. "
    "Consult a qualified healthcare professional for clinical evaluation and treatment."
)


def generate_report(diagnosis: Diagnosis) -> Dict[str, Any]:
    demographics = diagnosis.demographics or {}
    age = demographics.get("age")
    sex = demographics.get("sex")

    report: Dict[str, Any] = {
        "report_id": diagnosis.id,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "patient": {
            "user_id": diagnosis.user_id,
            "age": age,
            "sex": sex,
        },
        "timestamp": diagnosis.timestamp.isoformat() if diagnosis.timestamp else None,
        "symptoms": diagnosis.symptoms or {},
        "vitals": diagnosis.vitals or {},
        "prediction": {
            "top_prediction": diagnosis.top_prediction,
            "distribution": diagnosis.distribution or [],
        },
        "doctor_review": {
            "status": str(diagnosis.doctor_review_status),
            "feedback": diagnosis.doctor_feedback,
        },
        "disclaimer": DISCLAIMER,
    }

    return report

