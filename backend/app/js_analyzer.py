def analyze_javascript(data):

    score = 0
    reasons = []

    total_scripts = data.externalScripts + data.inlineScripts

    # Heavy JavaScript only if combined with forms/passwords

    if total_scripts >= 150 and data.passwordFields > 0:
        score += 10
        reasons.append("Heavy JavaScript on credential page")

    if data.inlineScripts >= 120 and data.passwordFields > 0:
        score += 5
        reasons.append("Large inline JavaScript on login page")

    if data.externalScripts >= 30 and data.passwordFields > 0:
        score += 5
        reasons.append("Many external scripts on login page")

    score = min(score, 100)

    if score >= 15:
        confidence = "High"
        category = "Aggressive JavaScript"
    elif score >= 5:
        confidence = "Medium"
        category = "Suspicious JavaScript"
    else:
        confidence = "Low"
        category = "Normal JavaScript"

    return {
        "score": score,
        "confidence": confidence,
        "category": category,
        "reasons": reasons
    }