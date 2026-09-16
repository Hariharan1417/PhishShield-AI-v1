import sys
from pathlib import Path

# Add backend folder to Python path
BACKEND_PATH = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(BACKEND_PATH))

from app.similarity_engine import url_similarity
from app.entropy_engine import url_entropy
from app.tld_engine import tld_probability

from app.character_features import (
    count_letters,
    count_digits,
    count_special,
    letter_ratio,
    digit_ratio,
    special_ratio
)

from app.obfuscation_features import (
    has_obfuscation,
    encoded_characters,
    obfuscation_ratio,
    continuation_rate
)

from app.url_features import (
    is_ip,
    subdomain_count,
    tld_length)
from urllib.parse import urlparse
from app.similarity_engine import url_similarity
from app.entropy_engine import url_entropy
from app.tld_engine import tld_probability
from app.character_features import (
    count_letters,
    count_digits,
    count_special,
    letter_ratio,
    digit_ratio,
    special_ratio,
)
from app.obfuscation_features import (
    has_obfuscation,
    encoded_characters,
    obfuscation_ratio,
    continuation_rate,
)
from app.url_features import (
    is_ip,
    subdomain_count,
    tld_length,
)
import pandas as pd


def generate_features(url):

    parsed = urlparse(url)

    domain = parsed.netloc.lower().replace("www.", "")

    similarity = url_similarity(url)

    return {

        "URLLength": len(url),

        "DomainLength": len(domain),

        "IsDomainIP": is_ip(domain),

        "URLSimilarityIndex": similarity["score"],

        "CharContinuationRate": continuation_rate(url),

        "TLDLegitimateProb": tld_probability(domain),

        "URLCharProb": url_entropy(url),

        "TLDLength": tld_length(domain),

        "NoOfSubDomain": subdomain_count(domain),

        "HasObfuscation": has_obfuscation(url),

        "NoOfObfuscatedChar": encoded_characters(url),

        "ObfuscationRatio": obfuscation_ratio(url),

        "NoOfLettersInURL": count_letters(url),

        "LetterRatioInURL": letter_ratio(url),

        "NoOfDegitsInURL": count_digits(url),

        "DegitRatioInURL": digit_ratio(url),

        "NoOfOtherSpecialCharsInURL": count_special(url),

        "SpacialCharRatioInURL": special_ratio(url),

        "IsHTTPS": 1 if parsed.scheme == "https" else 0
    }
# Original Dataset
DATASET_PATH = "../dataset/PhiUSIIL_Phishing_URL_Dataset.csv"

# Output Dataset
OUTPUT_PATH = "phishshield_training_dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("=" * 60)
print("Original Dataset Loaded")
print("=" * 60)

print("Rows :", len(df))
print("Columns :", len(df.columns))

print("\nColumns:\n")
print(df.columns.tolist())

print("\nLabel Distribution:\n")
print(df["label"].value_counts())

# Create New Dataset
rows = []

for _, row in df.iterrows():

    features = generate_features(row["URL"])

    features["label"] = row["label"]

    rows.append(features)

training_df = pd.DataFrame(rows)
print("\n")
print(training_df.head())

training_df.to_csv(
    OUTPUT_PATH,
    index=False
)

print("\nTraining Dataset Saved Successfully")
print(OUTPUT_PATH)