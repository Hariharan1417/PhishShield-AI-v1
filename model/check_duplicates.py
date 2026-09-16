import pandas as pd

df = pd.read_csv("phishshield_training_dataset_v3.csv")

print("Rows :", len(df))

print("Duplicate Rows :", df.duplicated().sum())

print("Duplicate Feature Rows :")

print(df.drop(columns=["label"]).duplicated().sum())