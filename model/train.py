import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
# Load dataset
df = pd.read_csv("../dataset/PhiUSIIL_Phishing_URL_Dataset.csv")

# Basic Information
print(df.head())

print("\n------------------")

print(df.columns)

print("\n------------------")

print(df.info())

print("\n------------------")

print(df["label"].value_counts())
# Features and Target
# Remove string columns
selected_features = [
    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "NoOfSubDomain",
    "IsHTTPS",
    "HasTitle",
    "HasFavicon",
    "HasPasswordField",
    "HasHiddenFields",
    "HasSubmitButton",
    "HasExternalFormSubmit",
    "NoOfPopup"
]

X = df[selected_features]
y = df["label"]
# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Create Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train Model
print(df["label"].value_counts())
print(df[["URL", "label"]].head(20))
model.fit(X_train, y_train)
print(model.classes_)

# Prediction
predictions = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, predictions)

print("\n========================")
print("Accuracy:", accuracy)
print("========================")

# Save Model
joblib.dump(model, "phishshield_model.pkl")

print("Model Saved Successfully!")