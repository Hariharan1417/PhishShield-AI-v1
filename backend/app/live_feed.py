import requests

OPENPHISH_URL = "https://openphish.com/feed.txt"


def check_openphish(url: str):
    try:
        response = requests.get(OPENPHISH_URL, timeout=10)

        if response.status_code != 200:
            return False

        phishing_urls = response.text.splitlines()

        return url in phishing_urls

    except Exception as e:
        print("OpenPhish Error:", e)
        return False