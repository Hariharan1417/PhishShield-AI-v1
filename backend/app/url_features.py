from urllib.parse import urlparse
import re


def parse_url(url: str):

    parsed = urlparse(url)

    hostname = parsed.hostname or ""

    return {
        "url": url,
        "domain": hostname.lower(),
        "path": parsed.path,
        "scheme": parsed.scheme.lower()
    }


def is_ip(domain: str):

    return 1 if re.fullmatch(
        r"\d{1,3}(\.\d{1,3}){3}",
        domain
    ) else 0


def subdomain_count(domain: str):

    parts = domain.split(".")

    if len(parts) <= 2:
        return 0

    return len(parts) - 2


def tld_length(domain: str):

    if "." not in domain:
        return 0

    return len(domain.split(".")[-1])