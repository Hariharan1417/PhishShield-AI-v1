import pandas as pd


df = pd.read_csv("phishshield_training_dataset_v3.csv")

features = [
    col
    for col in df.columns
    if col != "label"
]

print("=" * 60)
print("V3 DATASET DUPLICATE CHECK")
print("=" * 60)

print("Total Rows:", len(df))

print(
    "\nExact Duplicate Rows:",
    df.duplicated().sum()
)

print(
    "Duplicate Feature Rows:",
    df[features].duplicated().sum()
)


# ==========================================================
# CHECK CONFLICTING LABELS
# Same feature vector -> different labels
# ==========================================================

grouped = (
    df.groupby(features, dropna=False)["label"]
    .nunique()
)

conflicting = grouped[grouped > 1]

print(
    "\nFeature Vectors With Conflicting Labels:",
    len(conflicting)
)


# ==========================================================
# TRAIN / TEST OVERLAP CHECK
# ==========================================================

from sklearn.model_selection import train_test_split

X = df[features]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

train_keys = set(
    map(tuple, X_train.to_numpy())
)

test_keys = set(
    map(tuple, X_test.to_numpy())
)

overlap = train_keys.intersection(test_keys)

print(
    "\nUnique Feature Vectors Shared Between Train/Test:",
    len(overlap)
)

print("=" * 60)