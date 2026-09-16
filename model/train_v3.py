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
# LOAD V3 DATASET
# ==========================================================

DATASET = "phishshield_training_dataset_v3.csv"

df = pd.read_csv(DATASET)

print("=" * 60)
print("PhishShield AI V3 Training")
print("=" * 60)

print("Dataset Shape :", df.shape)


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


print("\nNumber of Features :", len(FEATURE_NAMES))

print("\nFeatures:")

for i, feature in enumerate(FEATURE_NAMES, 1):
    print(f"{i:02d}. {feature}")


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


print("\nTraining Samples :", len(X_train))
print("Testing Samples  :", len(X_test))


# ==========================================================
# RANDOM FOREST V3
# ==========================================================

model = RandomForestClassifier(

    n_estimators=300,

    random_state=42,

    n_jobs=-1
)


# ==========================================================
# TRAIN
# ==========================================================

print("\n" + "=" * 60)
print("Training Started...")
print("=" * 60)

model.fit(
    X_train,
    y_train
)

print("\nTraining Completed.")


# ==========================================================
# PREDICTION
# ==========================================================

predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]


# ==========================================================
# ACCURACY
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
print("MODEL PERFORMANCE")
print("=" * 60)

print("\nAccuracy :", round(accuracy, 4))

print("ROC-AUC  :", round(roc_auc, 4))


# ==========================================================
# CLASSIFICATION REPORT
# ==========================================================

print("\nClassification Report\n")

print(
    classification_report(
        y_test,
        predictions
    )
)


# ==========================================================
# CONFUSION MATRIX
# ==========================================================

print("\nConfusion Matrix\n")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ==========================================================
# FEATURE IMPORTANCE
# ==========================================================

importance = pd.DataFrame({

    "Feature": FEATURE_NAMES,

    "Importance": model.feature_importances_

})


importance = importance.sort_values(

    by="Importance",

    ascending=False
)


print("\n" + "=" * 60)
print("TOP 20 IMPORTANT FEATURES")
print("=" * 60)

print(
    importance.head(20).to_string(
        index=False
    )
)


# ==========================================================
# SAVE MODEL
# ==========================================================

MODEL_FILE = "phishshield_model_v3.pkl"

joblib.dump(
    model,
    MODEL_FILE
)


print("\n" + "=" * 60)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 60)

print(MODEL_FILE)

print("\nFeature Count :", len(FEATURE_NAMES))