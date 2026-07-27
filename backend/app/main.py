from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import create_table
from .history import (
    save_scan,
    get_history,
    get_stats,
    clear_history,
    delete_history_item,
)
from .live_feed import check_openphish
from .reason_engine import generate_reasons
from .trusted_checker import is_trusted_domain
from .feature_extractor import extract_features
from .ai_model import predict_website

create_table()

app = FastAPI(
    title="PhishShield AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "project": "PhishShield AI",
        "status": "Backend Running Successfully"
    }


class WebsiteData(BaseModel):
    url: str
    title: str
    forms: int
    passwordFields: int
    emailFields: int
    links: int
    hasFavicon: int
    hasHiddenFields: int
    hasSubmitButton: int
    hasExternalFormSubmit: int
    noOfPopup: int


@app.post("/analyze")
def analyze(data: WebsiteData):

    # Trusted Domain
    if is_trusted_domain(data.url):

        reasons = generate_reasons(data, "Trusted Domain")

        save_scan(
            data.url,
            "Safe",
            0,
            "Trusted Domain"
        )

        return {
            "status": "Safe",
            "riskScore": 0,
            "source": "Trusted Domain",
            "reasons": reasons
        }

    # OpenPhish
    if check_openphish(data.url):

        reasons = generate_reasons(data, "OpenPhish")

        save_scan(
            data.url,
            "Phishing",
            100,
            "OpenPhish"
        )

        return {
            "status": "Phishing",
            "riskScore": 100,
            "source": "OpenPhish",
            "reasons": reasons
        }

    # AI Model
    features = extract_features(data)

    result = predict_website(features)

    result["source"] = "AI Model"
    result["reasons"] = generate_reasons(data, "AI Model")

    save_scan(
        data.url,
        result["status"],
        result["riskScore"],
        result["source"]
    )

    return result


@app.get("/history")
def history():

    rows = get_history()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "url": row[1],
            "status": row[2],
            "riskScore": row[3],
            "source": row[4],
            "scanTime": row[5]
        })

    return result


@app.get("/stats")
def stats():
    return get_stats()


@app.delete("/history")
def delete_history():
    return clear_history()


# NEW: Delete single history record
@app.delete("/history/{record_id}")
def delete_history_record(record_id: int):
    return delete_history_item(record_id)