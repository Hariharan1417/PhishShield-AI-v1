import pandas as pd

df = pd.read_csv("phishshield_training_dataset_v3.csv")

print(df.nunique())

print("\n====================")

print(df.corr(numeric_only=True)["label"].sort_values(ascending=False))