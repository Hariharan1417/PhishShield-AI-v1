import re

def title_match(domain, title):

    if not title:
        return 0

    domain = domain.lower().replace("www.", "")

    words = re.findall(r"[a-z0-9]+", title.lower())

    if not words:
        return 0

    matched = sum(
        1
        for word in words
        if word in domain
    )

    return round(
        matched / len(words),
        4
    )