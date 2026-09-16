import joblib
import pandas as pd
from pathlib import Path


# ==========================================================
# V3 MODEL PATH
# ==========================================================

MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "model"
    / "phishshield_model_v3.pkl"
)

model = joblib.load(MODEL_PATH)


# ==========================================================
# V3 FEATURE ORDER
# MUST MATCH TRAINING DATASET
# ==========================================================

FEATURE_NAMES = [

    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "URLSimilarityIndex",
    "CharContinuationRate",
    "TLDLegitimateProb",
    "URLCharProb",
    "TLDLength",
    "NoOfSubDomain",

    "HasObfuscation",
    "NoOfObfuscatedChar",
    "ObfuscationRatio",

    "NoOfLettersInURL",
    "LetterRatioInURL",
    "NoOfDegitsInURL",
    "DegitRatioInURL",
    "NoOfOtherSpecialCharsInURL",
    "SpacialCharRatioInURL",

    "IsHTTPS",

    "HasTitle",
    "HasFavicon",
    "HasDescription",
    "HasPasswordField",
    "HasHiddenFields",
    "HasSubmitButton",
    "HasExternalFormSubmit",
    "NoOfPopup",
    "NoOfiFrame",

    "NoOfExternalRef",
    "NoOfSelfRef",
    "NoOfEmptyRef",
    "NoOfURLRedirect",

    "HasSocialNet",
    "HasCopyrightInfo",
    "Robots",
    "IsResponsive",

    "DomainTitleMatchScore",
    "URLTitleMatchScore"
]


# ==========================================================
# PREDICTION FUNCTION
# ==========================================================

def predict_website(features):

    # Convert feature list into DataFrame
    df = pd.DataFrame(
        [features],
        columns=FEATURE_NAMES
    )

    print("\n========== INPUT FEATURES ==========")
    print(df)

    # AI Prediction
    prediction = model.predict(df)

    # Probability
    probability = model.predict_proba(df)[0]

    print("\n========== PREDICTION ==========")
    print(prediction)

    print("\n========== PROBABILITY ==========")
    print(probability)

    # Phishing probability
    phishing_probability = probability[1]

    # Convert probability to risk score
    riskScore = round(
        phishing_probability * 100
    )

    # ======================================================
    # STATUS
    # ======================================================

    if riskScore >= 80:
        status = "Phishing"

    elif riskScore >= 60:
        status = "Suspicious"

    elif riskScore >= 30:
        status = "Low Risk"

    else:
        status = "Safe"

    # ======================================================
    # CONFIDENCE
    # ======================================================

    if riskScore >= 75:
        confidence = "High"

    elif riskScore >= 40:
        confidence = "Medium"

    else:
        confidence = "Low"

    # ======================================================
    # FINAL AI RESULT
    # ======================================================

    return {
        "status": status,
        "riskScore": riskScore,
        "category": "AI Detection",
        "confidence": confidence
    }