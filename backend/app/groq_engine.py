import os
import json

from dotenv import load_dotenv
from groq import Groq


# ==========================================
# Load Environment
# ==========================================

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY not found. Check your .env file."
    )


# ==========================================
# Groq Client
# ==========================================

client = Groq(
    api_key=API_KEY,
    timeout=4.0,
)


# ==========================================
# Groq Context Analysis
# ==========================================

def analyze_with_groq(
    url,
    ai_result,
    rule_result,
    html_result,
    js_result,
    reputation_result
):

    """
    Groq contextual analysis layer.

    V3 ML remains the primary detection model.
    Groq provides additional contextual reasoning.

    A short timeout is used so that Groq does not
    make the browser scan wait indefinitely.
    """

    # ==========================================
    # Compact Prompt
    # ==========================================

    prompt = f"""
You are a cybersecurity website risk analyst.

Analyze this website using ONLY the supplied detection results.

URL:
{url}

AI:
{json.dumps(ai_result, separators=(",", ":"))}

RULE:
{json.dumps(rule_result, separators=(",", ":"))}

HTML:
{json.dumps(html_result, separators=(",", ":"))}

JS:
{json.dumps(js_result, separators=(",", ":"))}

REPUTATION:
{json.dumps(reputation_result, separators=(",", ":"))}

Classify as:
Safe, Low Risk, Suspicious, or Phishing.

Return ONLY valid JSON:

{{
  "verdict": "Safe",
  "confidence": 0,
  "risk_adjustment": 0,
  "reasons": [],
  "recommendation": "No immediate action required."
}}

Rules:
- confidence: 0-100
- risk_adjustment: -20 to 20
- reasons must be short
- do not invent facts
- HTTPS alone does not prove safety
"""


    # ==========================================
    # Groq Request
    # ==========================================

    try:

        response = client.chat.completions.create(

            # Faster lightweight model
            model="llama-3.1-8b-instant",

            messages=[

                {
                    "role": "system",
                    "content":
                        "You are a cybersecurity risk analyst."
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ],

            temperature=0,

            max_tokens=250
        )


        # ==========================================
        # Parse Response
        # ==========================================

        raw_output = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )


        result = json.loads(
            raw_output
        )


        # ==========================================
        # Return Result
        # ==========================================

        return {

            "verdict":
                result.get(
                    "verdict",
                    "Unknown"
                ),

            "confidence":
                result.get(
                    "confidence",
                    0
                ),

            "risk_adjustment":
                result.get(
                    "risk_adjustment",
                    0
                ),

            "reasons":
                result.get(
                    "reasons",
                    []
                ),

            "recommendation":
                result.get(
                    "recommendation",
                    "No recommendation available."
                ),

            "category":
                "Groq Context Analysis"
        }


    # ==========================================
    # Groq Failure / Timeout
    # ==========================================

    except Exception as e:

        print(
            "⚠️ Groq Engine Error:",
            e
        )

        return {

            "verdict":
                "Unavailable",

            "confidence":
                0,

            "risk_adjustment":
                0,

            "reasons": [
                "Groq analysis unavailable."
            ],

            "recommendation":
                "Use existing detection engines.",

            "category":
                "Groq Context Analysis"
        }