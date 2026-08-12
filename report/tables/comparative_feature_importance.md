# Comparative Feature Importance (Model Gain vs Split Weight)

> Use in **Section 4.8** and **Table 4.x**.  
> **Gain** = average improvement when a feature is used to split (closer to “how much the feature matters when used”).  
> **Weight** = how often a feature is used in splits (frequency).  
> **SHAP rank** should be confirmed from your `shap_summary_plot.png` / notebook Cell 18 top-10 table; placeholders marked *verify from plot*.

## Table: Top 15 features by XGBoost gain

| Rank (Gain) | Feature (processed name) | Manager-readable name | Gain | Weight rank* |
|-------------|--------------------------|------------------------|------|--------------|
| 1 | `cat__OverTime_Yes` | Overtime (Yes) | 31.68 | 8 |
| 2 | `num__JobLevel` | Job level | 15.24 | — |
| 3 | `num__StockOptionLevel` | Stock option level | 11.74 | — |
| 4 | `cat__BusinessTravel_Travel_Frequently` | Frequent business travel | 9.48 | — |
| 5 | `cat__MaritalStatus_Single` | Marital status: Single | 8.11 | — |
| 6 | `cat__EducationField_Medical` | Education field: Medical | 7.70 | — |
| 7 | `num__TotalWorkingYears` | Total working years | 7.68 | — |
| 8 | `cat__JobRole_Sales Executive` | Job role: Sales Executive | 6.76 | — |
| 9 | `cat__JobRole_Laboratory Technician` | Job role: Lab Technician | 6.63 | — |
| 10 | `cat__JobRole_Research Scientist` | Job role: Research Scientist | 6.37 | — |
| 11 | `cat__Department_Research & Development` | Department: R&D | 6.04 | — |
| 12 | `cat__JobRole_Manager` | Job role: Manager | 5.47 | — |
| 13 | `num__YearsWithCurrManager` | Years with current manager | 5.40 | 10 |
| 14 | `cat__EducationField_Marketing` | Education field: Marketing | 4.44 | — |
| 15 | `num__WorkLifeBalance` | Work–life balance | 4.42 | — |

\*Weight top 10 (most frequently used splits): MonthlyIncome (1), Age (2), DailyRate (3), DistanceFromHome (4), HourlyRate (5), PercentSalaryHike (6), NumCompaniesWorked (7), OverTime_Yes (8), MonthlyRate (9), YearsWithCurrManager (10).

## Interpretation for the dissertation

- **Gain** emphasises *categorical risk switches* (especially **Overtime**) and structural role/level factors.
- **Weight** emphasises *continuous HR variables* (income, age, distance, rates) that the trees split on often.
- **SHAP** (global mean \|SHAP\|) typically reconciles both views by ranking **Overtime**, **compensation/tenure-related**, and **satisfaction** drivers in a way managers can read case-by-case.
- This dual view strengthens Chapter 4: built-in importance is not identical to SHAP; the framework therefore reports **both** model-centric and explanation-centric rankings.

## Files

- `metrics/xgb_feature_importance.csv` — scikit-learn / XGB `feature_importances_`
- `metrics/xgb_gain_importance.csv` — booster gain scores
