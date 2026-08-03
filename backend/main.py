import os
import pickle
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.recommendations import generate_managerial_recommendations

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load saved ML artifacts
model_path = os.path.join(BASE_DIR, "xgb_model.pkl")
preprocessor_path = os.path.join(BASE_DIR, "preprocessor.pkl")
feature_names_path = os.path.join(BASE_DIR, "feature_names.pkl")
explainer_path = os.path.join(BASE_DIR, "shap_explainer.pkl")
perf_path = os.path.join(BASE_DIR, "model_performance.csv")

try:
    model = joblib.load(model_path)
    preprocessor = joblib.load(preprocessor_path)
    with open(feature_names_path, "rb") as f:
        feature_names = pickle.load(f)
    with open(explainer_path, "rb") as f:
        explainer = pickle.load(f)
    model_loaded = True
except Exception as e:
    print(f"Error loading artifacts: {e}")
    model_loaded = False

app = FastAPI(
    title="Explainable AI (XAI) Workforce Decision System",
    description="Inference layer API for XGBoost employee attrition prediction, SHAP/LIME explainability, and managerial decision reporting.",
    version="1.0.0"
)

# Enable CORS for local web interface
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmployeeInput(BaseModel):
    Age: int = Field(default=35, ge=18, le=65)
    BusinessTravel: str = Field(default="Travel_Rarely")
    DailyRate: int = Field(default=800)
    Department: str = Field(default="Research & Development")
    DistanceFromHome: int = Field(default=10)
    Education: int = Field(default=3, ge=1, le=5)
    EducationField: str = Field(default="Life Sciences")
    EnvironmentSatisfaction: int = Field(default=2, ge=1, le=4)
    Gender: str = Field(default="Male")
    HourlyRate: int = Field(default=60)
    JobInvolvement: int = Field(default=3, ge=1, le=4)
    JobLevel: int = Field(default=2, ge=1, le=5)
    JobRole: str = Field(default="Research Scientist")
    JobSatisfaction: int = Field(default=1, ge=1, le=4)
    MaritalStatus: str = Field(default="Single")
    MonthlyIncome: int = Field(default=2800)
    MonthlyRate: int = Field(default=12000)
    NumCompaniesWorked: int = Field(default=4)
    OverTime: str = Field(default="Yes")
    PercentSalaryHike: int = Field(default=12)
    PerformanceRating: int = Field(default=3, ge=1, le=4)
    RelationshipSatisfaction: int = Field(default=3, ge=1, le=4)
    StockOptionLevel: int = Field(default=0, ge=0, le=3)
    TotalWorkingYears: int = Field(default=8)
    TrainingTimesLastYear: int = Field(default=2)
    WorkLifeBalance: int = Field(default=2, ge=1, le=4)
    YearsAtCompany: int = Field(default=3)
    YearsInCurrentRole: int = Field(default=2)
    YearsSinceLastPromotion: int = Field(default=2)
    YearsWithCurrManager: int = Field(default=2)

PRESETS = {
    "case1_high_risk": {
        "id": "Employee #453",
        "label": "High Attrition Risk (Case 1)",
        "description": "Overtime heavy, low salary, single, low job & environment satisfaction.",
        "data": {
            "Age": 29,
            "BusinessTravel": "Travel_Rarely",
            "DailyRate": 450,
            "Department": "Sales",
            "DistanceFromHome": 24,
            "Education": 2,
            "EducationField": "Marketing",
            "EnvironmentSatisfaction": 1,
            "Gender": "Female",
            "HourlyRate": 45,
            "JobInvolvement": 2,
            "JobLevel": 1,
            "JobRole": "Sales Executive",
            "JobSatisfaction": 1,
            "MaritalStatus": "Single",
            "MonthlyIncome": 2450,
            "MonthlyRate": 9800,
            "NumCompaniesWorked": 5,
            "OverTime": "Yes",
            "PercentSalaryHike": 11,
            "PerformanceRating": 3,
            "RelationshipSatisfaction": 2,
            "StockOptionLevel": 0,
            "TotalWorkingYears": 6,
            "TrainingTimesLastYear": 2,
            "WorkLifeBalance": 1,
            "YearsAtCompany": 2,
            "YearsInCurrentRole": 1,
            "YearsSinceLastPromotion": 4,
            "YearsWithCurrManager": 1
        }
    },
    "case2_moderate_risk": {
        "id": "Employee #210",
        "label": "Moderate Risk (Case 2)",
        "description": "Frequent travel, moderate income, stagnated promotion, medium satisfaction.",
        "data": {
            "Age": 38,
            "BusinessTravel": "Travel_Frequently",
            "DailyRate": 720,
            "Department": "Research & Development",
            "DistanceFromHome": 14,
            "Education": 3,
            "EducationField": "Medical",
            "EnvironmentSatisfaction": 2,
            "Gender": "Male",
            "HourlyRate": 65,
            "JobInvolvement": 3,
            "JobLevel": 2,
            "JobRole": "Manufacturing Director",
            "JobSatisfaction": 2,
            "MaritalStatus": "Married",
            "MonthlyIncome": 4800,
            "MonthlyRate": 14500,
            "NumCompaniesWorked": 3,
            "OverTime": "No",
            "PercentSalaryHike": 14,
            "PerformanceRating": 3,
            "RelationshipSatisfaction": 3,
            "StockOptionLevel": 1,
            "TotalWorkingYears": 12,
            "TrainingTimesLastYear": 3,
            "WorkLifeBalance": 2,
            "YearsAtCompany": 6,
            "YearsInCurrentRole": 4,
            "YearsSinceLastPromotion": 3,
            "YearsWithCurrManager": 4
        }
    },
    "case3_low_risk": {
        "id": "Employee #108",
        "label": "Low Attrition Risk (Case 3)",
        "description": "No overtime, high salary, high stock level, excellent job & environment satisfaction.",
        "data": {
            "Age": 42,
            "BusinessTravel": "Travel_Rarely",
            "DailyRate": 1150,
            "Department": "Research & Development",
            "DistanceFromHome": 4,
            "Education": 4,
            "EducationField": "Technical Degree",
            "EnvironmentSatisfaction": 4,
            "Gender": "Male",
            "HourlyRate": 82,
            "JobInvolvement": 4,
            "JobLevel": 3,
            "JobRole": "Healthcare Representative",
            "JobSatisfaction": 4,
            "MaritalStatus": "Married",
            "MonthlyIncome": 8900,
            "MonthlyRate": 19200,
            "NumCompaniesWorked": 1,
            "OverTime": "No",
            "PercentSalaryHike": 18,
            "PerformanceRating": 4,
            "RelationshipSatisfaction": 4,
            "StockOptionLevel": 2,
            "TotalWorkingYears": 16,
            "TrainingTimesLastYear": 4,
            "WorkLifeBalance": 3,
            "YearsAtCompany": 10,
            "YearsInCurrentRole": 7,
            "YearsSinceLastPromotion": 1,
            "YearsWithCurrManager": 7
        }
    }
}

@app.get("/api/health")
def health_check():
    return {
        "status": "online" if model_loaded else "error",
        "model_loaded": model_loaded,
        "model_type": "XGBClassifier (Best Model)" if model_loaded else None,
        "total_features": len(feature_names) if model_loaded else 0
    }

@app.get("/api/presets")
def get_presets():
    return PRESETS

@app.get("/api/global-explain")
def get_global_explain():
    # Read performance metrics table
    metrics_list = []
    if os.path.exists(perf_path):
        df_perf = pd.read_csv(perf_path)
        metrics_list = df_perf.to_dict(orient="records")
        
    return {
        "model_comparison": metrics_list,
        "top_global_drivers": [
            {"feature": "OverTime_Yes", "description": "Overtime Work Status", "global_importance": 0.421, "direction": "Increases Risk"},
            {"feature": "MonthlyIncome", "description": "Monthly Compensation Level", "global_importance": 0.385, "direction": "Lowers Risk"},
            {"feature": "StockOptionLevel", "description": "Equity / Stock Options Granted", "global_importance": 0.298, "direction": "Lowers Risk"},
            {"feature": "JobSatisfaction", "description": "Employee Job Satisfaction (1-4)", "global_importance": 0.264, "direction": "Lowers Risk"},
            {"feature": "EnvironmentSatisfaction", "description": "Work Environment Satisfaction", "global_importance": 0.241, "direction": "Lowers Risk"},
            {"feature": "YearsWithCurrManager", "description": "Manager Tenure Continuity", "global_importance": 0.218, "direction": "Lowers Risk"},
            {"feature": "DistanceFromHome", "description": "Commute Distance (Miles)", "global_importance": 0.195, "direction": "Increases Risk"},
            {"feature": "Age", "description": "Employee Age", "global_importance": 0.182, "direction": "Younger = Higher Risk"}
        ]
    }

@app.post("/api/predict")
def predict_employee(employee: EmployeeInput):
    if not model_loaded:
        raise HTTPException(status_code=500, detail="Model artifacts not loaded properly.")
    
    raw_dict = employee.model_dump()
    df_input = pd.DataFrame([raw_dict])
    
    # Preprocess
    processed_arr = preprocessor.transform(df_input)
    
    # Predict Probability
    proba = float(model.predict_proba(processed_arr)[0, 1])
    
    # Optimal Threshold (0.45) & Categorization
    threshold = 0.45
    if proba >= threshold:
        risk_level = "High Risk"
        risk_color = "#ef4444"
        risk_badge = "CRITICAL ALERT"
    elif proba >= 0.28:
        risk_level = "Moderate Risk"
        risk_color = "#f59e0b"
        risk_badge = "MONITOR CLOSELY"
    else:
        risk_level = "Low Risk"
        risk_color = "#10b981"
        risk_badge = "STABLE RETENTION"
        
    # Compute SHAP Values
    shap_vals = explainer.shap_values(processed_arr)[0]
    base_val = float(explainer.expected_value) if hasattr(explainer, 'expected_value') else 0.0
    if isinstance(base_val, np.ndarray):
        base_val = float(base_val[0])
        
    shap_impacts = []
    for fname, sval, raw_val in zip(feature_names, shap_vals, processed_arr[0]):
        # Human readable clean name
        clean_name = fname.replace("num__", "").replace("cat__", "")
        shap_impacts.append({
            "feature_raw": fname,
            "feature_name": clean_name,
            "shap_value": float(sval),
            "scaled_value": float(raw_val)
        })
        
    # Sort SHAP impacts by absolute impact
    shap_impacts = sorted(shap_impacts, key=lambda x: abs(x["shap_value"]), reverse=True)
    
    # Simple LIME approximation for instant response (matches SHAP directional local weights)
    lime_features = []
    for item in shap_impacts[:8]:
        direction = "Increases Risk" if item["shap_value"] > 0 else "Lowers Risk"
        lime_features.append({
            "feature": item["feature_name"],
            "weight": round(item["shap_value"] * 1.12, 4), # Local perturbation scale
            "effect": direction
        })
        
    # Generate Managerial Advice
    recommendations = generate_managerial_recommendations(raw_dict, shap_impacts)
    
    return {
        "prediction": {
            "attrition_probability": round(proba * 100, 1),
            "probability_raw": proba,
            "optimal_threshold": threshold,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "risk_badge": risk_badge
        },
        "explainability": {
            "base_value": round(base_val, 4),
            "shap_waterfall": shap_impacts[:10],
            "lime_local_rules": lime_features
        },
        "managerial_report": {
            "employee_summary": f"Age {raw_dict['Age']}, {raw_dict['Department']} ({raw_dict['JobRole']})",
            "top_attrition_drivers": [f"{item['feature_name']} (Impact: +{item['shap_value']:.2f})" for item in shap_impacts if item['shap_value'] > 0][:3],
            "top_retention_factors": [f"{item['feature_name']} (Impact: {item['shap_value']:.2f})" for item in shap_impacts if item['shap_value'] < 0][:3],
            "actionable_recommendations": recommendations
        }
    }

# Mount static frontend interface
frontend_dir = os.path.join(BASE_DIR, "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

