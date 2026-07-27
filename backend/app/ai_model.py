import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parents[2] / "model" / "phishshield_model.pkl"

model = joblib.load(MODEL_PATH)

FEATURE_NAMES = [
    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "NoOfSubDomain",
    "IsHTTPS",
    "HasTitle",
    "HasFavicon",
    "HasPasswordField",
    "HasHiddenFields",
    "HasSubmitButton",
    "HasExternalFormSubmit",
    "NoOfPopup"
]

def predict_website(features):

    df = pd.DataFrame([features], columns=FEATURE_NAMES)

    print("\n========== INPUT FEATURES ==========")
    print(df)

    prediction = model.predict(df)

    print("\n========== PREDICTION ==========")
    print(prediction)

    if prediction[0] == 1:
        return {
            "status": "Phishing",
            "riskScore": 95
        }

    return {
        "status": "Safe",
        "riskScore": 10
    }