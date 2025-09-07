from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.diagnosis import DiagnosisRead
from app.services.diagnosis_service import get_diagnoses_by_user, get_diagnosis_by_id


router = APIRouter()


@router.get("/{user_id}", response_model=List[DiagnosisRead])
def list_user_diagnoses(user_id: str, db: Session = Depends(get_db)):
    return get_diagnoses_by_user(db, user_id)


@router.get("/detail/{diagnosis_id}", response_model=DiagnosisRead)
def diagnosis_detail(diagnosis_id: str, db: Session = Depends(get_db)):
    diag = get_diagnosis_by_id(db, diagnosis_id)
    if not diag:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return diag

