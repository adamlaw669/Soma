from io import BytesIO
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

from app.db import get_db
from app.models.diagnosis import Diagnosis
from app.services.report_service import generate_report


router = APIRouter()


def _draw_wrapped_text(c: canvas.Canvas, text: str, x: float, y: float, max_width: float, leading: float = 14):
    from textwrap import wrap

    lines = []
    for paragraph in text.split("\n"):
        lines.extend(wrap(paragraph, width=int(max_width / 7)))
        lines.append("")
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


@router.get("/{diagnosis_id}")
def get_report(diagnosis_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    diag = db.query(Diagnosis).filter(Diagnosis.id == diagnosis_id).first()
    if not diag:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return generate_report(diag)


@router.get("/{diagnosis_id}/pdf")
def get_report_pdf(diagnosis_id: str, db: Session = Depends(get_db)):
    diag = db.query(Diagnosis).filter(Diagnosis.id == diagnosis_id).first()
    if not diag:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    data = generate_report(diag)

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    margin = 0.75 * inch
    x = margin
    y = height - margin

    c.setFont("Helvetica-Bold", 16)
    c.drawString(x, y, "Soma Diagnosis Report")
    y -= 24

    c.setFont("Helvetica", 10)
    c.drawString(x, y, f"Report ID: {data.get('report_id')}")
    y -= 12
    c.drawString(x, y, f"Generated At: {data.get('generated_at')}")
    y -= 18

    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "Patient")
    y -= 14
    c.setFont("Helvetica", 11)
    patient = data.get("patient", {})
    c.drawString(x, y, f"User ID: {patient.get('user_id')}")
    y -= 12
    c.drawString(x, y, f"Age: {patient.get('age')}")
    y -= 12
    c.drawString(x, y, f"Sex: {patient.get('sex')}")
    y -= 18

    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "Symptoms")
    y -= 14
    c.setFont("Helvetica", 11)
    symptoms = data.get("symptoms", {})
    if not symptoms:
      c.drawString(x, y, "None reported")
      y -= 12
    else:
      for k, v in symptoms.items():
        c.drawString(x, y, f"- {k}: {v}")
        y -= 12
        if y < margin:
          c.showPage()
          y = height - margin

    y -= 6
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "Vitals")
    y -= 14
    c.setFont("Helvetica", 11)
    vitals = data.get("vitals", {})
    if not vitals:
      c.drawString(x, y, "N/A")
      y -= 12
    else:
      for k, v in vitals.items():
        c.drawString(x, y, f"- {k}: {v}")
        y -= 12
        if y < margin:
          c.showPage()
          y = height - margin

    y -= 6
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "Prediction")
    y -= 14
    c.setFont("Helvetica", 11)
    pred = data.get("prediction", {})
    c.drawString(x, y, f"Top: {pred.get('top_prediction')}")
    y -= 12
    dist = pred.get("distribution", [])
    for item in dist:
      c.drawString(x, y, f"- {item.get('label')}: {item.get('probability')}")
      y -= 12
      if y < margin:
        c.showPage()
        y = height - margin

    y -= 6
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "Doctor Review")
    y -= 14
    c.setFont("Helvetica", 11)
    dr = data.get("doctor_review", {})
    c.drawString(x, y, f"Status: {dr.get('status')}")
    y -= 12
    feedback = dr.get("feedback")
    if feedback:
      c.drawString(x, y, "Feedback:")
      y -= 12
      y = _draw_wrapped_text(c, str(feedback), x, y, width - 2 * margin)

    y -= 6
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, y, "Disclaimer")
    y -= 14
    c.setFont("Helvetica", 10)
    y = _draw_wrapped_text(c, data.get("disclaimer", ""), x, y, width - 2 * margin, leading=12)

    c.showPage()
    c.save()
    buffer.seek(0)

    headers = {"Content-Disposition": f"attachment; filename=report_{diagnosis_id}.pdf"}
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)

