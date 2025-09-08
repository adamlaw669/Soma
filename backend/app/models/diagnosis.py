from __future__ import annotations

from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import uuid4
from enum import Enum as PyEnum

from pydantic import BaseModel
from sqlalchemy import Column, String, DateTime, JSON, Enum as SAEnum
from sqlalchemy.sql import func

from app.db import Base


class DoctorReviewStatus(str, PyEnum):
    pending = "pending"
    correct = "correct"
    incorrect = "incorrect"


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    user_id = Column(String, nullable=False, index=True, default="anonymous")
    symptoms = Column(JSON, nullable=False)
    vitals = Column(JSON, nullable=True)
    demographics = Column(JSON, nullable=True)
    top_prediction = Column(String, nullable=False)
    distribution = Column(JSON, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    doctor_review_status = Column(
        SAEnum(DoctorReviewStatus, name="doctor_review_status"),
        nullable=False,
        default=DoctorReviewStatus.pending,
    )
    doctor_feedback = Column(String, nullable=True)


# ----------------------
# Pydantic Schemas
# ----------------------


class DiagnosisBase(BaseModel):
    user_id: Optional[str] = "anonymous"
    symptoms: Dict[str, Any]
    vitals: Optional[Dict[str, Any]] = None
    demographics: Optional[Dict[str, Any]] = None
    top_prediction: str
    distribution: List[Dict[str, Any]]
    doctor_review_status: DoctorReviewStatus = DoctorReviewStatus.pending
    doctor_feedback: Optional[str] = None


class DiagnosisCreate(DiagnosisBase):
    pass


class DiagnosisRead(DiagnosisBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

