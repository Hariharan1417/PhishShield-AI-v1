import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)


# ==========================================================
# LOAD DATASET
# ==========================================================

df = pd.read_csv("phishshield_training_dataset_v3.csv")

print("=" * 60)
print("PhishShield AI V3 - Clean Validation")
print("=" * 60)

print("Original Rows:", len(df))


# ==========================================================
# REMOVE EXACT DUPLICATES
# ==========================================================

before = len(df)

df = df.drop_duplicates().reset_index(drop=True)

after = len(df)

print("Duplicate Rows Removed:", before - after)
print("Clean Rows:", after)


# ==========================================================
# FEATURES / LABEL
# ==========================================================

FEATURE_NAMES = [
    col
    for col in df.columns
    if col != "label"
]

X = df[FEATURE_NAMES]
y = df["label"]


print("Feature Count:", len(FEATURE_NAMES))


# ==========================================================
# TRAIN / TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("Training Samples:", len(X_train))
print("Testing Samples :", len(X_test))


# ==========================================================
# MODEL
# ==========================================================

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)


# ==========================================================
# TRAIN
# ==========================================================

print("\nTraining Started...")

model.fit(
    X_train,
    y_train
)

print("Training Completed.")


# ==========================================================
# PREDICTION
# ==========================================================

predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]


# ==========================================================
# METRICS
# ==========================================================

accuracy = accuracy_score(
    y_test,
    predictions
)

roc_auc = roc_auc_score(
    y_test,
    probabilities
)


print("\n" + "=" * 60)
print("CLEAN MODEL PERFORMANCE")
print("=" * 60)

print("Accuracy:", round(accuracy, 4))
print("ROC-AUC :", round(roc_auc, 4))


print("\nClassification Report\n")

print(
    classification_report(
        y_test,
        predictions
    )
)


print("\nConfusion Matrix\n")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ==========================================================
# SAVE VALIDATION MODEL
# ==========================================================

joblib.dump(
    model,
    "phishshield_model_v3_clean.pkl"
)

print("\nModel Saved:")
print("phishshield_model_v3_clean.pkl")