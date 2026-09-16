from .js_analyzer import analyze_javascript
from .risk_engine import calculate_risk
from .reputation_engine import analyze_reputation
from .html_analyzer import analyze_html

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from pydantic import BaseModel

from .groq_engine import analyze_with_groq
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
from .rule_engine import analyze_rules


# ==========================================
# Database
# ==========================================

create_table()


# ==========================================
# FastAPI
# ==========================================

app = FastAPI(
    title="PhishShield AI API",
    version="3.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Home
# ==========================================

@app.get("/")
def home():

    return {
        "project": "PhishShield AI",
        "status": "Backend Running Successfully"
    }


# ==========================================
# Request Model
# ==========================================

class WebsiteData(BaseModel):

    # ==========================
    # Advanced HTML Features
    # ==========================

    iframes: int
    externalScripts: int
    inlineScripts: int
    hiddenElements: int

    # ==========================
    # Existing Features
    # ==========================

    url: str
    title: str
    protocol: str

    forms: int
    passwordFields: int
    emailFields: int
    links: int

    hasFavicon: int
    hasHiddenFields: int
    hasSubmitButton: int
    hasExternalFormSubmit: int

    noOfPopup: int

    # ==========================
    # URL Features
    # ==========================

    urlLength: int
    domainLength: int
    dotCount: int
    hyphenCount: int
    underscoreCount: int
    digitCount: int
    specialCharCount: int
    subdomainCount: int

    isHTTPS: int
    isIPAddress: int

    hasLoginKeyword: int
    hasBankKeyword: int
    hasCryptoKeyword: int
    hasSecureKeyword: int

    # ==========================
    # V3 Dataset Features
    # ==========================

    hasDescription: int
    robots: int
    isResponsive: int

    noOfImage: int
    noOfCSS: int
    noOfJS: int
    noOfiFrame: int

    hasSocialNet: int
    hasCopyrightInfo: int

    noOfExternalRef: int
    noOfSelfRef: int
    noOfEmptyRef: int
    noOfURLRedirect: int


# ==========================================
# Helper: Build Complete Reasons
# ==========================================

def build_detection_reasons(
    data,
    ai_result,
    rule_result,
    html_result,
    js_result,
    reputation_result,
    groq_result,
    trusted_domain=False
):

    reasons = []

    # ==========================================
    # Trusted Domain Information
    # ==========================================

    if trusted_domain:

        reasons.append(
            "Domain is present in the PhishShield trusted-domain list."
        )

    # ==========================================
    # URL Security Signals
    # ==========================================

    if data.isHTTPS == 0:

        reasons.append(
            "Website uses HTTP instead of HTTPS."
        )

    if data.isIPAddress == 1:

        reasons.append(
            "Website uses an IP address instead of a domain name."
        )

    if data.hasLoginKeyword == 1:

        reasons.append(
            "Login or verification keyword detected in the URL."
        )

    if data.hasBankKeyword == 1:

        reasons.append(
            "Financial or payment-related keyword detected in the URL."
        )

    if data.hasCryptoKeyword == 1:

        reasons.append(
            "Cryptocurrency-related keyword detected in the URL."
        )

    if data.hasSecureKeyword == 1:

        reasons.append(
            "Security or authentication keyword detected in the URL."
        )

    if data.subdomainCount > 1:

        reasons.append(
            f"URL contains multiple subdomains ({data.subdomainCount})."
        )

    if data.digitCount >= 5:

        reasons.append(
            "URL contains an unusually high number of digits."
        )

    # ==========================================
    # Rule Engine
    # ==========================================

    rule_score = rule_result.get(
        "score",
        0
    )

    if rule_score >= 60:

        reasons.append(
            f"Rule Engine detected multiple suspicious URL signals (score {rule_score})."
        )

    elif rule_score >= 30:

        reasons.append(
            f"Rule Engine detected suspicious characteristics (score {rule_score})."
        )

    # ==========================================
    # HTML Engine
    # ==========================================

    html_score = html_result.get(
        "score",
        0
    )

    if html_score >= 60:

        reasons.append(
            f"HTML analysis detected suspicious page characteristics (score {html_score})."
        )

    elif html_score >= 30:

        reasons.append(
            f"HTML analysis found potentially risky characteristics (score {html_score})."
        )

    # ==========================================
    # JavaScript Engine
    # ==========================================

    js_score = js_result.get(
        "score",
        0
    )

    if js_score >= 60:

        reasons.append(
            f"JavaScript analysis detected suspicious behavior (score {js_score})."
        )

    elif js_score >= 30:

        reasons.append(
            f"JavaScript analysis found potentially risky behavior (score {js_score})."
        )

    # ==========================================
    # Reputation Engine
    # ==========================================

    reputation_score = reputation_result.get(
        "score",
        0
    )

    if reputation_score >= 60:

        reasons.append(
            f"Reputation Engine indicates poor reputation signals (score {reputation_score})."
        )

    elif reputation_score >= 30:

        reasons.append(
            f"Reputation Engine detected moderate reputation risk (score {reputation_score})."
        )

    # ==========================================
    # AI Engine
    # ==========================================

    ai_score = ai_result.get(
        "riskScore",
        0
    )

    if ai_score >= 80:

        reasons.append(
            f"V3 AI model classified the website as high risk (risk score {ai_score})."
        )

    elif ai_score >= 60:

        reasons.append(
            f"V3 AI model detected significant risk (risk score {ai_score})."
        )

    # ==========================================
    # Groq AI
    # ==========================================

    groq_reasons = groq_result.get(
        "reasons",
        []
    )

    if isinstance(
        groq_reasons,
        list
    ):

        for reason in groq_reasons:

            if not isinstance(
                reason,
                str
            ):
                continue

            clean_reason = reason.strip()

            if not clean_reason:
                continue

            # Avoid exact duplicates
            if clean_reason not in reasons:

                reasons.append(
                    clean_reason
                )

    # ==========================================
    # Fallback
    # ==========================================

    if not reasons:

        reasons = [
            "No significant security indicators were detected."
        ]

    return reasons


# ==========================================
# Analyze Website
# ==========================================

@app.post("/analyze")
def analyze(
    data: WebsiteData
):

    # ==========================================
    # Trusted Domain Check
    # ==========================================
    #
    # IMPORTANT:
    # Trusted domains are NOT returned immediately.
    #
    # They continue through the complete detection
    # pipeline so that the website is still analyzed.
    #
    # ==========================================

    trusted_domain = is_trusted_domain(
        data.url
    )

    if trusted_domain:

        print(
            "✅ Trusted domain detected:",
            data.url
        )


    # ==========================================
    # OpenPhish
    # ==========================================

    if check_openphish(
        data.url
    ):

        reasons = generate_reasons(
            data,
            "OpenPhish"
        )

        save_scan(
            data.url,
            "Phishing",
            100,
            "OpenPhish"
        )

        return {

            "status": "Phishing",

            "riskScore": 100,

            "confidence": "Very High",

            "highestEngine": "OpenPhish",

            "source": "OpenPhish",

            "reasons": reasons,

            "recommendation":
                "Do not visit this website or enter any credentials.",

            "aiEngine": {
                "category": "Skipped"
            },

            "ruleEngine": {
                "category": "Skipped"
            },

            "htmlEngine": {
                "category": "Skipped"
            },

            "jsEngine": {
                "category": "Skipped"
            },

            "reputationEngine": {
                "category": "Blacklisted"
            },

            "groqEngine": {
                "category": "Skipped"
            },

            "trustedDomain":
                trusted_domain
        }


    # ==========================================
    # V3 AI Model
    # ==========================================

    features = extract_features(
        data
    )

    ai_result = predict_website(
        features
    )


    # ==========================================
    # Rule Engine
    # ==========================================

    rule_result = analyze_rules(
        data
    )


    # ==========================================
    # HTML Engine
    # ==========================================

    html_result = analyze_html(
        data
    )


    # ==========================================
    # JavaScript Engine
    # ==========================================

    js_result = analyze_javascript(
        data
    )


    # ==========================================
    # Reputation Engine
    # ==========================================

    reputation_result = analyze_reputation(
        data
    )


    # ==========================================
    # Groq Context Analysis
    # ==========================================

    groq_result = analyze_with_groq(

        url=data.url,

        ai_result=ai_result,

        rule_result=rule_result,

        html_result=html_result,

        js_result=js_result,

        reputation_result=reputation_result
    )


    print(
        "========== GROQ RESULT =========="
    )

    print(
        groq_result
    )


    # ==========================================
    # Hybrid Risk Engine
    # ==========================================

    final_result = calculate_risk(

        ai_result,

        rule_result,

        html_result,

        js_result,

        reputation_result,

        groq_result
    )


    # ==========================================
    # Complete Detection Reasons
    # ==========================================

    reasons = build_detection_reasons(

        data,

        ai_result,

        rule_result,

        html_result,

        js_result,

        reputation_result,

        groq_result,

        trusted_domain
    )


    # ==========================================
    # Trusted Domain Safety Adjustment
    # ==========================================
    #
    # Trusted domain is only an additional signal.
    #
    # It does NOT override a phishing detection.
    #
    # ==========================================

    if trusted_domain:

        reasons.insert(
            0,
            "Domain is recognized as trusted by PhishShield AI."
        )

        # Remove duplicate if already present
        cleaned_reasons = []

        for reason in reasons:

            if reason not in cleaned_reasons:

                cleaned_reasons.append(
                    reason
                )

        reasons = cleaned_reasons


    # ==========================================
    # Final Response
    # ==========================================

    response = {

        "status":
            final_result["status"],

        "riskScore":
            final_result["riskScore"],

        "confidence":
            final_result["confidence"],

        "highestEngine":
            final_result["highestEngine"],

        "source":
            "Hybrid Detection Engine",

        "reasons":
            reasons,

        "recommendation":
            groq_result.get(
                "recommendation",
                "Do not enter sensitive information until the website is verified."
            ),

        "aiEngine":
            ai_result,

        "ruleEngine":
            rule_result,

        "htmlEngine":
            html_result,

        "jsEngine":
            js_result,

        "reputationEngine":
            reputation_result,

        "groqEngine":
            groq_result,

        "trustedDomain":
            trusted_domain
    }


    # ==========================================
    # Save Scan History
    # ==========================================

    save_scan(

        data.url,

        response["status"],

        response["riskScore"],

        response["source"]
    )


    # ==========================================
    # Debug Output
    # ==========================================

    print(
        "========== FINAL RESULT =========="
    )

    print(
        response
    )


    return response


# ==========================================
# History
# ==========================================

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


# ==========================================
# Statistics
# ==========================================

@app.get("/stats")
def stats():

    return get_stats()


# ==========================================
# Clear History
# ==========================================

@app.delete("/history")
def delete_history():

    return clear_history()


# ==========================================
# Delete History Item
# ==========================================

@app.delete("/history/{record_id}")
def delete_history_record(
    record_id: int
):

    return delete_history_item(
        record_id
    )