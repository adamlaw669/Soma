from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.diagnosis import Diagnosis, DiagnosisCreate


def create_diagnosis(db: Session, payload: DiagnosisCreate) -> Diagnosis:
    diagnosis = Diagnosis(
        user_id=payload.user_id or "anonymous",
        symptoms=payload.symptoms,
        vitals=payload.vitals,
        demographics=payload.demographics,
        top_prediction=payload.top_prediction,
        distribution=payload.distribution,
        doctor_review_status=payload.doctor_review_status,
        doctor_feedback=payload.doctor_feedback,
    )
    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)
    return diagnosis


def get_diagnoses_by_user(db: Session, user_id: str) -> List[Diagnosis]:
    return (
        db.query(Diagnosis)
        .filter(Diagnosis.user_id == user_id)
        .order_by(Diagnosis.timestamp.desc())
        .all()
    )


def get_diagnosis_by_id(db: Session, diagnosis_id: str) -> Optional[Diagnosis]:
    return db.query(Diagnosis).filter(Diagnosis.id == diagnosis_id).first()

