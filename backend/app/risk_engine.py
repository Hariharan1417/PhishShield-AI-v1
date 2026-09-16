def calculate_risk(
    ai_result,
    rule_result,
    html_result,
    js_result,
    reputation_result,
    groq_result
):

    # ==========================================
    # GET SCORES
    # ==========================================

    ai_score = ai_result.get("riskScore", 0)
    rule_score = rule_result.get("score", 0)
    html_score = html_result.get("score", 0)
    js_score = js_result.get("score", 0)
    reputation_score = reputation_result.get("score", 0)

    groq_adjustment = groq_result.get(
        "risk_adjustment",
        0
    )

    groq_verdict = groq_result.get(
        "verdict",
        "Unavailable"
    )

    print("\n========== HYBRID RISK ENGINE ==========")
    print("AI:", ai_score)
    print("Rule:", rule_score)
    print("HTML:", html_score)
    print("JS:", js_score)
    print("Reputation:", reputation_score)
    print("Groq Adjustment:", groq_adjustment)
    print("Groq Verdict:", groq_verdict)

    # ==========================================
    # BASE HYBRID SCORE
    # ==========================================
    #
    # AI          = 40%
    # Rule        = 30%
    # HTML        = 10%
    # JavaScript  = 10%
    # Reputation  = 10%
    #

    base_score = round(
        (ai_score * 0.40) +
        (rule_score * 0.30) +
        (html_score * 0.10) +
        (js_score * 0.10) +
        (reputation_score * 0.10)
    )

    print("Base Score:", base_score)

    # ==========================================
    # GROQ ADJUSTMENT
    # ==========================================

    final_score = base_score + groq_adjustment

    # ==========================================
    # RULE ENGINE SECURITY FLOOR
    # ==========================================

    # Strong rule signals should not become
    # Safe simply because AI has a low score.

    if rule_score >= 70:
        final_score = max(
            final_score,
            70
        )

    elif rule_score >= 50:
        final_score = max(
            final_score,
            60
        )

    elif rule_score >= 40:
        final_score = max(
            final_score,
            45
        )

    # ==========================================
    # HTML SECURITY FLOOR
    # ==========================================

    if html_score >= 60:
        final_score = max(
            final_score,
            60
        )

    elif html_score >= 40:
        final_score = max(
            final_score,
            45
        )

    # ==========================================
    # REPUTATION SECURITY FLOOR
    # ==========================================

    if reputation_score >= 70:
        final_score = max(
            final_score,
            75
        )

    elif reputation_score >= 50:
        final_score = max(
            final_score,
            60
        )

    # ==========================================
    # GROQ VERDICT
    # ==========================================

    if groq_verdict == "Suspicious":
        final_score = max(
            final_score,
            60
        )

    elif groq_verdict == "Phishing":
        final_score = max(
            final_score,
            80
        )

    # ==========================================
    # SPECIAL HIGH-RISK COMBINATION
    # ==========================================

    # Multiple independent engines agreeing
    # should strongly increase confidence.

    high_risk_engines = 0

    if ai_score >= 60:
        high_risk_engines += 1

    if rule_score >= 50:
        high_risk_engines += 1

    if html_score >= 50:
        high_risk_engines += 1

    if js_score >= 50:
        high_risk_engines += 1

    if reputation_score >= 50:
        high_risk_engines += 1

    if high_risk_engines >= 3:
        final_score = max(
            final_score,
            75
        )

    # ==========================================
    # LIMIT SCORE
    # ==========================================

    final_score = max(
        0,
        min(round(final_score), 100)
    )

    # ==========================================
    # STATUS
    # ==========================================

    if final_score >= 80:
        status = "Phishing"

    elif final_score >= 60:
        status = "Suspicious"

    elif final_score >= 30:
        status = "Low Risk"

    else:
        status = "Safe"

    # ==========================================
    # CONFIDENCE
    # ==========================================

    if final_score >= 80:
        confidence = "Very High"

    elif final_score >= 60:
        confidence = "High"

    elif final_score >= 40:
        confidence = "Medium"

    else:
        confidence = "Low"

    # ==========================================
    # HIGHEST CONTRIBUTING ENGINE
    # ==========================================

    engines = {
        "AI Engine": ai_score,
        "Rule Engine": rule_score,
        "HTML Engine": html_score,
        "JavaScript Engine": js_score,
        "Reputation Engine": reputation_score
    }

    highest_engine = max(
        engines,
        key=engines.get
    )

    # ==========================================
    # DEBUG
    # ==========================================

    print("High Risk Engines:", high_risk_engines)
    print("Final Score:", final_score)
    print("Status:", status)
    print("Confidence:", confidence)
    print("Highest Engine:", highest_engine)
    print("=========================================\n")

    # ==========================================
    # FINAL RESULT
    # ==========================================

    return {
        "status": status,
        "riskScore": final_score,
        "confidence": confidence,
        "highestEngine": highest_engine
    }