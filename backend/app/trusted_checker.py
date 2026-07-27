import json
from pathlib import Path
from urllib.parse import urlparse

TRUSTED_DB = (
    Path(__file__).resolve().parents[2]
    / "threat_db"
    / "trusted_domains.json"
)


def is_trusted_domain(url: str):

    domain = urlparse(url).netloc.lower()

    if domain.startswith("www."):
        domain = domain[4:]

    with open(TRUSTED_DB, "r") as file:
        trusted = json.load(file)

    trusted = [d.lower() for d in trusted]

    return domain in trusted