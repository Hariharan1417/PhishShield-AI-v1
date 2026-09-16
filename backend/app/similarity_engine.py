from urllib.parse import urlparse
from rapidfuzz import fuzz

TRUSTED_BRANDS = [

    "google",
    "amazon",
    "microsoft",
    "apple",
    "paypal",
    "github",
    "facebook",
    "instagram",
    "linkedin",
    "twitter",
    "netflix",
    "adobe",
    "dropbox",
    "icici",
    "hdfc",
    "sbi",
    "axis",
    "flipkart",
    "youtube",
    "openai"

]


def url_similarity(url: str):

    domain = urlparse(url).netloc.lower()

    domain = domain.replace("www.", "")

    domain = domain.split(".")[0]

    best = 0

    best_brand = ""

    for brand in TRUSTED_BRANDS:

        score = fuzz.ratio(domain, brand)

        if score > best:

            best = score

            best_brand = brand

    return {
        "score": round(best / 100, 4),
        "brand": best_brand
    }