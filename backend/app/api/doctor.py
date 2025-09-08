from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Header, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.diagnosis import DiagnosisRead, DoctorReviewStatus
from app.services.doctor_service import (
    get_pending_diagnoses,
    get_diagnosis_for_doctor,
    update_doctor_review,
)


router = APIRouter()


def require_doctor(
    x_role: Optional[str] = Header(None, alias="x-role"), role: Optional[str] = Query(None)
):
    if (x_role or role) != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access required")


class ReviewRequest(BaseModel):
    status: DoctorReviewStatus
    feedback: Optional[str] = None


@router.get("/diagnoses", response_model=List[DiagnosisRead])
def list_pending(*, db: Session = Depends(get_db), _=Depends(require_doctor)):
    return get_pending_diagnoses(db)


@router.get("/diagnosis/{diagnosis_id}", response_model=DiagnosisRead)
def get_one(diagnosis_id: str, db: Session = Depends(get_db), _=Depends(require_doctor)):
    diag = get_diagnosis_for_doctor(db, diagnosis_id)
    if not diag:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return diag


@router.post("/review/{diagnosis_id}", response_model=DiagnosisRead)
def review(
    diagnosis_id: str,
    payload: ReviewRequest,
    db: Session = Depends(get_db),
    _=Depends(require_doctor),
):
    if payload.status not in {DoctorReviewStatus.correct, DoctorReviewStatus.incorrect}:
        raise HTTPException(status_code=400, detail="Status must be 'correct' or 'incorrect'")
    updated = update_doctor_review(db, diagnosis_id, payload.status, payload.feedback)
    if not updated:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return updated

