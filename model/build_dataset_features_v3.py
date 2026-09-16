import sys
from pathlib import Path

sys.path.insert(
    0,
    str(Path(__file__).resolve().parents[1] / "backend")
)
import pandas as pd
from types import SimpleNamespace

from app.feature_pipeline_v3 import build_feature_vector


# ==========================================================
# PATHS
# ==========================================================

INPUT_FILE = "../dataset/PhiUSIIL_Phishing_URL_Dataset.csv"
OUTPUT_FILE = "phishshield_training_dataset_v3.csv"


# ==========================================================
# LOAD DATASET
# ==========================================================

df = pd.read_csv(INPUT_FILE)

print("=" * 60)
print("Original Dataset Loaded")
print("=" * 60)

print("Rows :", len(df))
print("Columns :", len(df.columns))


# ==========================================================
# CREATE DATA OBJECT
# ==========================================================

def create_data_object(row):

    title = row["Title"]

    if pd.isna(title):
        title = ""

    return SimpleNamespace(

        # --------------------------
        # URL
        # --------------------------

        url=str(row["URL"]),

        isHTTPS=int(row["IsHTTPS"]),

        # --------------------------
        # HTML
        # --------------------------

        title=str(title),

        hasFavicon=int(row["HasFavicon"]),

        hasDescription=int(row["HasDescription"]),

        passwordFields=int(row["HasPasswordField"]),

        hasHiddenFields=int(row["HasHiddenFields"]),

        hasSubmitButton=int(row["HasSubmitButton"]),

        hasExternalFormSubmit=int(
            row["HasExternalFormSubmit"]
        ),

        noOfPopup=int(row["NoOfPopup"]),

        noOfiFrame=int(row["NoOfiFrame"]),

        # --------------------------
        # References
        # --------------------------

        noOfExternalRef=int(row["NoOfExternalRef"]),

        noOfSelfRef=int(row["NoOfSelfRef"]),

        noOfEmptyRef=int(row["NoOfEmptyRef"]),

        noOfURLRedirect=int(row["NoOfURLRedirect"]),

        hasSocialNet=int(row["HasSocialNet"]),

        hasCopyrightInfo=int(row["HasCopyrightInfo"]),

        robots=int(row["Robots"]),

        isResponsive=int(row["IsResponsive"])
    )


# ==========================================================
# FEATURE ORDER
# ==========================================================

FEATURE_ORDER = [

    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "URLSimilarityIndex",
    "CharContinuationRate",
    "TLDLegitimateProb",
    "URLCharProb",
    "TLDLength",
    "NoOfSubDomain",

    "HasObfuscation",
    "NoOfObfuscatedChar",
    "ObfuscationRatio",

    "NoOfLettersInURL",
    "LetterRatioInURL",
    "NoOfDegitsInURL",
    "DegitRatioInURL",
    "NoOfOtherSpecialCharsInURL",
    "SpacialCharRatioInURL",

    "IsHTTPS",

    "HasTitle",
    "HasFavicon",
    "HasDescription",
    "HasPasswordField",
    "HasHiddenFields",
    "HasSubmitButton",
    "HasExternalFormSubmit",
    "NoOfPopup",
    "NoOfiFrame",

    "NoOfExternalRef",
    "NoOfSelfRef",
    "NoOfEmptyRef",
    "NoOfURLRedirect",

    "HasSocialNet",
    "HasCopyrightInfo",
    "Robots",
    "IsResponsive",

    "DomainTitleMatchScore",
    "URLTitleMatchScore"
]


# ==========================================================
# BUILD FEATURES
# ==========================================================

feature_rows = []

total = len(df)

print()
print("=" * 60)
print("Building V3 Features")
print("=" * 60)

for index, row in df.iterrows():

    data = create_data_object(row)

    feature_dict = build_feature_vector(data)

    feature_row = [
        feature_dict[name]
        for name in FEATURE_ORDER
    ]

    feature_row.append(int(row["label"]))

    feature_rows.append(feature_row)

    # Progress
    if (index + 1) % 10000 == 0:

        print(
            f"Processed: {index + 1}/{total}"
        )


# ==========================================================
# CREATE TRAINING DATAFRAME
# ==========================================================

columns = FEATURE_ORDER + ["label"]

training_df = pd.DataFrame(
    feature_rows,
    columns=columns
)


# ==========================================================
# VALIDATION
# ==========================================================

print()
print("=" * 60)
print("V3 Dataset Validation")
print("=" * 60)

print("Shape :", training_df.shape)

print()
print("Missing Values:")

print(
    training_df.isnull().sum().sum()
)

print()
print("Label Distribution:")

print(
    training_df["label"].value_counts()
)


# ==========================================================
# SAVE
# ==========================================================

training_df.to_csv(
    OUTPUT_FILE,
    index=False
)

print()
print("=" * 60)
print("Training Dataset Saved Successfully")
print("=" * 60)

print(OUTPUT_FILE)

print()
print("Features :", len(FEATURE_ORDER))
print("Columns  :", len(columns))