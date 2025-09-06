# app/services/predictor.py
import joblib, os, numpy as np
from app.schemas import PredictRequest
from app.models.predict import DistributionItem, TopPrediction  
import typing

class Predictor:
    def __init__(self, artifact_path="models/soma_model_v1.joblib"):
        if not os.path.exists(artifact_path):
            raise FileNotFoundError(f"Model artifact not found at {artifact_path}")
        obj = joblib.load(artifact_path)
        self.model = obj["model"]
        self.feature_cols = obj["feature_cols"]
        self.label_classes = obj["label_classes"]
        self.symptom_key_mapping = obj.get("symptom_key_mapping", {})

    def _build_row(self, req: PredictRequest):
        row = []
        s = req.symptoms or {}
        # determine if frontend symptom exists for each colum in the dataset
        for col in self.feature_cols:
            mapped_frontend_keys = [k for k,v in self.symptom_key_mapping.items() if v==col]
            val = 0
            if mapped_frontend_keys:
                fk = mapped_frontend_keys[0]
                val = 1 if s.get(fk, False) else 0
            else:
                # fallback
                for fk in s:
                    if fk.lower() in col.lower() and s.get(fk):
                        val = 1
                        break
            row.append(int(val))
        return np.array(row).reshape(1, -1)

    def predict(self, req: PredictRequest) -> typing.Dict:
        X = self._build_row(req)
        probs = self.model.predict_proba(X)[0]
        distribution = [{"label": self.label_classes[i], "probability": float(probs[i])} for i in range(len(probs))]
        top_idx = int(np.argmax(probs))
        top = distribution[top_idx]
     
        triage = "low" if top["probability"] < 0.5 else ("medium" if top["probability"] < 0.8 else "high")
        return {
            "top_prediction": top,
            "distribution": distribution,
            "triage": triage,
            "advice": ["Consult a healthcare professional for confirmation.", "Avoid self-medication."],
            "explanations": []  
        }
