def safe_ratio(a, b):
    return round(a / b, 4) if b else 0


def count_letters(url):
    return sum(c.isalpha() for c in url)


def count_digits(url):
    return sum(c.isdigit() for c in url)


def count_special(url):
    return sum(not c.isalnum() for c in url)


def letter_ratio(url):
    return safe_ratio(count_letters(url), len(url))


def digit_ratio(url):
    return safe_ratio(count_digits(url), len(url))


def special_ratio(url):
    return safe_ratio(count_special(url), len(url))


def unique_char_probability(url):
    return safe_ratio(len(set(url)), len(url))