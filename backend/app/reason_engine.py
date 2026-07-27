def generate_reasons(data, source):

    reasons = []

    if source == "Trusted Domain":
        reasons.append({
            "type": "positive",
            "message": "Domain is in the trusted allowlist."
        })

    if data.url.startswith("https://"):
        reasons.append({
            "type": "positive",
            "message": "Website uses HTTPS."
        })
    else:
        reasons.append({
            "type": "warning",
            "message": "Website uses HTTP."
        })

    if data.hasHiddenFields:
        reasons.append({
            "type": "warning",
            "message": "Hidden form fields detected."
        })

    if data.hasExternalFormSubmit:
        reasons.append({
            "type": "warning",
            "message": "Form submits to an external domain."
        })

    return reasons