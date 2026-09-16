def analyze_reputation(data):

    score = 0
    reasons = []

    # HTTPS Check
    if data.isHTTPS == 0:
        score += 25
        reasons.append("Website is not using HTTPS")

    # IP Address URL
    if data.isIPAddress:
        score += 25
        reasons.append("Website uses an IP address")

    # Suspicious Keywords
    if data.hasLoginKeyword:
        score += 10
        reasons.append("Login-related keyword detected")

    if data.hasBankKeyword:
        score += 10
        reasons.append("Banking-related keyword detected")

    if data.hasCryptoKeyword:
        score += 10
        reasons.append("Cryptocurrency-related keyword detected")

    if data.hasSecureKeyword:
        score += 5
        reasons.append("Security-related keyword detected")

    # Long URL
    if data.urlLength > 100:
        score += 10
        reasons.append("Very long URL")

    # Many Subdomains
    if data.subdomainCount >= 3:
        score += 15
        reasons.append("Multiple subdomains detected")

    score = min(score, 100)

    if score >= 50:
        confidence = "High"
    elif score >= 25:
        confidence = "Medium"
    else:
        confidence = "Low"

    if score >= 50:
        category = "Poor Reputation"
    elif score >= 25:
        category = "Suspicious Reputation"
    else:
        category = "Good Reputation"

    return {
        "score": score,
        "confidence": confidence,
        "category": category,
        "reasons": reasons
    }