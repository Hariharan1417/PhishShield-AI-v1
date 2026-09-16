import re


def encoded_characters(url):
    return len(
        re.findall(
            r"%[0-9A-Fa-f]{2}",
            url
        )
    )


def has_obfuscation(url):
    return 1 if encoded_characters(url) else 0


def obfuscation_ratio(url):

    total = len(url)

    if total == 0:
        return 0

    return round(
        encoded_characters(url) / total,
        4
    )


def continuation_rate(url):

    if len(url) < 2:
        return 0

    repeated = 0

    for i in range(len(url)-1):

        if url[i] == url[i+1]:
            repeated += 1

    return round(
        repeated / len(url),
        4
    )