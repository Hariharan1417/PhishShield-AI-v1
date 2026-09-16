from collections import Counter
from math import log2


def url_entropy(text: str):

    if not text:
        return 0.0

    counter = Counter(text)

    total = len(text)

    entropy = 0

    for count in counter.values():

        probability = count / total

        entropy -= probability * log2(probability)

    return round(entropy, 4)