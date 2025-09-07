from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.diagnosis import Diagnosis, DoctorReviewStatus


def get_pending_diagnoses(db: Session) -> List[Diagnosis]:
    return (
        db.query(Diagnosis)
        .filter(Diagnosis.doctor_review_status == DoctorReviewStatus.pending)
        .order_by(Diagnosis.timestamp.desc())
        .all()
    )


def get_diagnosis_for_doctor(db: Session, diagnosis_id: str) -> Optional[Diagnosis]:
    return db.query(Diagnosis).filter(Diagnosis.id == diagnosis_id).first()


def update_doctor_review(
    db: Session, diagnosis_id: str, status: DoctorReviewStatus, feedback: Optional[str] = None
) -> Optional[Diagnosis]:
    diag = db.query(Diagnosis).filter(Diagnosis.id == diagnosis_id).first()
    if not diag:
        return None
    diag.doctor_review_status = status
    if feedback is not None:
        diag.doctor_feedback = feedback
    db.add(diag)
    db.commit()
    db.refresh(diag)
    return diag

