from urllib.parse import urlparse
import re


# =========================
# Suspicious Keywords
# =========================

LOGIN_KEYWORDS = {
    "login",
    "signin",
    "verify",
    "password",
    "account",
    "auth",
    "secure",
    "update"
}

BANK_KEYWORDS = {
    "bank",
    "paypal",
    "upi",
    "wallet",
    "payment",
    "credit",
    "debit"
}


# =========================
# Suspicious TLDs
# =========================

SUSPICIOUS_TLDS = {
    "zip",
    "xyz",
    "top",
    "click",
    "country",
    "gq",
    "tk"
}


# =========================
# Suspicious Hosting Platforms
# =========================

SUSPICIOUS_HOSTING = {
    "trycloudflare.com",
    "ngrok.io",
    "ngrok-free.app",
    "serveo.net",
    "loca.lt"
}


def analyze_rules(data):

    score = 0
    reasons = []

    parsed = urlparse(data.url)

    domain = (
        parsed.hostname.lower()
        if parsed.hostname
        else ""
    )

    full_url = data.url.lower()


    # =========================
    # Rule 1 - HTTPS
    # =========================

    if parsed.scheme != "https":

        score += 15

        reasons.append(
            "Website is not using HTTPS"
        )


    # =========================
    # Rule 2 - Long URL
    # =========================

    if len(data.url) > 100:

        score += 10

        reasons.append(
            "Very long URL"
        )


    # =========================
    # Rule 3 - IP Address
    # =========================

    if re.match(
        r"^\d+\.\d+\.\d+\.\d+$",
        domain
    ):

        score += 25

        reasons.append(
            "URL uses an IP address"
        )


    # =========================
    # Rule 4 - Too Many Subdomains
    # =========================

    if domain.count(".") >= 3:

        score += 10

        reasons.append(
            "Too many subdomains"
        )


    # =========================
    # Rule 5 - Login Keywords
    # =========================

    for word in LOGIN_KEYWORDS:

        if word in full_url:

            score += 10

            reasons.append(
                f"Login keyword detected: {word}"
            )

            break


    # =========================
    # Rule 6 - Banking Keywords
    # =========================

    for word in BANK_KEYWORDS:

        if word in full_url:

            score += 10

            reasons.append(
                f"Financial keyword detected: {word}"
            )

            break


    # =========================
    # Rule 7 - Suspicious TLD
    # =========================

    tld = (
        domain.split(".")[-1]
        if "." in domain
        else ""
    )

    if tld in SUSPICIOUS_TLDS:

        score += 15

        reasons.append(
            f"Suspicious top-level domain: .{tld}"
        )


    # =========================
    # Rule 8 - @ Symbol / User Info
    # =========================

    if "@" in full_url:

        score += 35

        reasons.append(
            "URL contains '@' symbol before the hostname"
        )


    # =========================
    # Rule 9 - Excessive Hyphens
    # =========================

    if full_url.count("-") >= 4:

        score += 8

        reasons.append(
            "Too many hyphens in URL"
        )


    # =========================
    # Rule 10 - URL Encoding
    # =========================

    if "%" in full_url:

        score += 8

        reasons.append(
            "Encoded characters found in URL"
        )


    # =========================
    # Rule 11 - Temporary Tunnel
    # =========================

    if any(
        domain == host
        or domain.endswith("." + host)
        for host in SUSPICIOUS_HOSTING
    ):

        score += 25

        reasons.append(
            "Website is hosted on a temporary tunneling platform"
        )


    # =========================
    # Rule 12 - Multiple Hyphens
    # =========================

    hostname_without_tld = (
        domain.split(".")[0]
        if domain
        else ""
    )

    if hostname_without_tld.count("-") >= 3:

        score += 15

        reasons.append(
            "Hostname contains multiple hyphens"
        )


    # =========================
    # Limit Score
    # =========================

    score = min(score, 100)


    # =========================
    # Rule Category
    # =========================

    if score >= 60:

        category = "High Rule Risk"

    elif score >= 30:

        category = "Suspicious Rules"

    elif score > 0:

        category = "Low Rule Risk"

    else:

        category = "Normal Rules"


    # =========================
    # Final Result
    # =========================

    return {

        "score": score,

        "category": category,

        "reasons": reasons

    }