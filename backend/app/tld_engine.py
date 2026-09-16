TLD_REPUTATION = {

    "com": 1.00,
    "org": 0.98,
    "net": 0.96,
    "edu": 1.00,
    "gov": 1.00,
    "mil": 1.00,

    "io": 0.95,
    "co": 0.92,
    "ai": 0.95,
    "app": 0.95,
    "dev": 0.95,

    "in": 0.95,

    "biz": 0.40,
    "xyz": 0.25,
    "top": 0.20,
    "click": 0.15,
    "live": 0.40,
    "online": 0.35,
    "shop": 0.45,
    "site": 0.30,
    "icu": 0.10,
    "tk": 0.05,
    "ml": 0.05,
    "ga": 0.05,
    "cf": 0.05

}


def tld_probability(domain: str):

    tld = domain.split(".")[-1].lower()

    return TLD_REPUTATION.get(tld, 0.50)