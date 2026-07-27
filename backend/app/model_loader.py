import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parents[2] / "model" / "phishshield_model.pkl"

model = joblib.load(MODEL_PATH)