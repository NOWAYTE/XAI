import os
import joblib
import pickle
import numpy as np
import pandas as pd
import shap

print("--- Testing Artifact Loading & Inference Pipeline ---")

BASE_DIR = r"c:\Users\Nowayte\XAI"

model_path = os.path.join(BASE_DIR, "xgb_model.pkl")
preprocessor_path = os.path.join(BASE_DIR, "preprocessor.pkl")
feature_names_path = os.path.join(BASE_DIR, "feature_names.pkl")
explainer_path = os.path.join(BASE_DIR, "shap_explainer.pkl")

model = joblib.load(model_path)
print("✔ XGBoost Model loaded successfully:", type(model))

preprocessor = joblib.load(preprocessor_path)
print("✔ Preprocessor loaded successfully:", type(preprocessor))

with open(feature_names_path, "rb") as f:
    feature_names = pickle.load(f)
print(f"✔ Feature names loaded ({len(feature_names)} features)")

with open(explainer_path, "rb") as f:
    explainer = pickle.load(f)
print("✔ SHAP Explainer loaded successfully:", type(explainer))

# Sample raw employee dict (IBM HR format)
sample_employee = {
    'Age': 35,
    'BusinessTravel': 'Travel_Rarely',
    'DailyRate': 800,
    'Department': 'Research & Development',
    'DistanceFromHome': 10,
    'Education': 3,
    'EducationField': 'Life Sciences',
    'EnvironmentSatisfaction': 2,
    'Gender': 'Male',
    'HourlyRate': 60,
    'JobInvolvement': 3,
    'JobLevel': 2,
    'JobRole': 'Research Scientist',
    'JobSatisfaction': 1,
    'MaritalStatus': 'Single',
    'MonthlyIncome': 2800,
    'MonthlyRate': 12000,
    'NumCompaniesWorked': 4,
    'OverTime': 'Yes',
    'PercentSalaryHike': 12,
    'PerformanceRating': 3,
    'RelationshipSatisfaction': 3,
    'StockOptionLevel': 0,
    'TotalWorkingYears': 8,
    'TrainingTimesLastYear': 2,
    'WorkLifeBalance': 2,
    'YearsAtCompany': 3,
    'YearsInCurrentRole': 2,
    'YearsSinceLastPromotion': 2,
    'YearsWithCurrManager': 2
}

df_sample = pd.DataFrame([sample_employee])
processed = preprocessor.transform(df_sample)
print("✔ Raw employee processed shape:", processed.shape)

proba = model.predict_proba(processed)[0, 1]
print(f"✔ Prediction probability: {proba:.4f}")

# SHAP values
shap_vals = explainer.shap_values(processed)[0]
print(f"✔ SHAP values computed ({len(shap_vals)} values)")

print("=== ALL ARTIFACT CHECKS PASSED PERFECTLY ===")
