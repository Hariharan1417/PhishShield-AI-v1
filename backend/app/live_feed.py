import requests
import time
from pathlib import Path


# ==========================================
# OpenPhish Configuration
# ==========================================

OPENPHISH_URL = "https://openphish.com/feed.txt"

CACHE_FILE = (
    Path(__file__).resolve().parent
    / "openphish_cache.txt"
)

# Refresh feed every 1 hour
CACHE_DURATION = 60 * 60


# ==========================================
# Download OpenPhish Feed
# ==========================================

def update_openphish_cache():

    try:

        print("🔄 Updating OpenPhish feed...")

        response = requests.get(
            OPENPHISH_URL,
            timeout=5
        )

        if response.status_code != 200:

            print(
                "OpenPhish HTTP Error:",
                response.status_code
            )

            return False


        # Save feed locally

        CACHE_FILE.write_text(
            response.text,
            encoding="utf-8"
        )

        print(
            "✅ OpenPhish feed updated."
        )

        return True


    except Exception as e:

        print(
            "⚠️ OpenPhish update error:",
            e
        )

        return False


# ==========================================
# Load Cached Feed
# ==========================================

def load_cached_feed():

    try:

        if not CACHE_FILE.exists():

            return set()


        urls = set()

        with open(
            CACHE_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            for line in file:

                url = line.strip()

                if url:

                    urls.add(url)


        return urls


    except Exception as e:

        print(
            "OpenPhish cache read error:",
            e
        )

        return set()


# ==========================================
# Check Whether Cache Needs Update
# ==========================================

def cache_needs_update():

    if not CACHE_FILE.exists():

        return True


    try:

        modified_time = CACHE_FILE.stat().st_mtime

        age =time.time() - modified_time

        return age >= CACHE_DURATION


    except Exception:

        return True


# ==========================================
# Phishing URL Check
# ==========================================

def check_openphish(url: str):

    try:

        # --------------------------------------
        # Update only when necessary
        # --------------------------------------

        if cache_needs_update():

            update_openphish_cache()


        # --------------------------------------
        # Load local feed
        # --------------------------------------

        phishing_urls = load_cached_feed()


        # --------------------------------------
        # Fast local lookup
        # --------------------------------------

        return url in phishing_urls


    except Exception as e:

        print(
            "OpenPhish Error:",
            e
        )

        return False