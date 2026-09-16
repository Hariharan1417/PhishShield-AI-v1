def analyze_html(data):

    score = 0
    reasons = []

    # ==========================
    # Credential Collection
    # ==========================

    if data.passwordFields > 0:
        score += 15
        reasons.append("Password field detected")

    if data.emailFields > 0:
        score += 3
        reasons.append("Email input detected")

    # ==========================
    # Form Analysis
    # ==========================

    if data.hasExternalFormSubmit:
        score += 25
        reasons.append("External form submission detected")

    if data.forms >= 5:
        score += 5
        reasons.append("Multiple forms found")

    # Submit button alone is normal
    # No score

    # ==========================
    # Hidden Elements
    # ==========================

    if data.hasHiddenFields and data.passwordFields > 0:
        score += 10
        reasons.append("Hidden fields with password form")

    if data.hiddenElements >= 20 and data.passwordFields > 0:
        score += 5

    # ==========================
    # iFrame Analysis
    # ==========================

    if data.iframes >= 2:
        score += 5
        reasons.append("Multiple iFrames detected")

    if data.iframes >= 5:
        score += 10
        reasons.append("Many iFrames detected")

    # ==========================
    # JavaScript Structure
    # ==========================

    # ==========================
    # Popups
    # ==========================

    if data.noOfPopup > 0:
        score += 15
        reasons.append("Popup detected")

    score = min(score, 100)

    if score >= 60:
        confidence = "High"
    elif score >= 30:
        confidence = "Medium"
    else:
        confidence = "Low"

    if score >= 60:
        category = "High Risk HTML"
    elif score >= 30:
        category = "Suspicious HTML Structure"
    else:
        category = "Normal HTML"

    return {
        "score": score,
        "confidence": confidence,
        "category": category,
        "reasons": reasons
    }