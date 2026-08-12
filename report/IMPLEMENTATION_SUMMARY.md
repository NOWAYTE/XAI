# Final Implementation Summary

## What was built

An end-to-end **Explainable AI (XAI) framework** for SME managerial decision support, demonstrated on **employee attrition** using the IBM HR Analytics dataset.

| Layer | Deliverable | Location |
|-------|-------------|----------|
| Experimentation | Full ML + XAI notebook | `XAI_Bus.ipynb` |
| Best model | XGBoost classifier | `xgb_model.pkl` |
| Preprocessing | ColumnTransformer pipeline | `preprocessor.pkl` |
| Features | 46 engineered feature names | `feature_names.pkl` |
| Explainability | Tree SHAP explainer | `shap_explainer.pkl` |
| Metrics | Test + CV results | `model_performance.csv`, `metrics/` |
| Error analysis | Per-employee outcomes | `reports/error_analysis.csv` |
| Figures | Confusion, ROC, SHAP, LIME, … | `figures/` |
| Inference API | FastAPI prediction + SHAP + recommendations | `backend/` |
| Manager UI | Next.js decision dashboard | `web/` |

## Headline results (held-out test set, *n* = 294)

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|-------|----------|-----------|--------|-----|---------|
| Decision Tree | 0.7857 | 0.3261 | 0.3191 | 0.3226 | 0.5968 |
| Random Forest | 0.8401 | 0.5000 | 0.2128 | 0.2985 | 0.7805 |
| **XGBoost** | **0.8776** | **0.7200** | **0.3830** | **0.5000** | **0.8041** |

**5-fold CV (F1 on SMOTE-resampled training data):**  
Decision Tree 0.855 ± 0.017 · Random Forest **0.932 ± 0.011** · XGBoost 0.927 ± 0.007  

**Confusion outcomes (XGBoost, default threshold):**  
TN 240 · TP 18 · FN 29 · FP 7  

**Strongest gain-based driver:** Overtime (`cat__OverTime_Yes`).

## Design choices that matter for the write-up

1. **Stratified 80/20 split** + **SMOTE on training only** (no leakage into test).
2. **Three models** compared; **XGBoost** selected on **ROC-AUC** (and strong precision).
3. **Dual XAI:** SHAP (global + local) and LIME (local cases).
4. **Decision support engine** maps top SHAP drivers + raw attributes → prioritised managerial actions.
5. **Prototype UI** makes explanations consumable by non-technical SME managers (TAM / trust narrative).

## Artefacts still for you to paste as images

| Figure | Source |
|--------|--------|
| Framework architecture | Render `report/figures/framework_architecture.md` (Mermaid → PNG) |
| Dataset distribution | Re-run notebook attrition bar **or** create from raw data |
| Correlation matrix | Re-run notebook cell 6 |
| ROC / PR / CM / FI / SHAP / LIME | Already in `figures/` |

## Dissertation mapping

- Chapters 1–3: complete in main `.docx`
- **Chapter 4:** `report/CHAPTER_4_System_Implementation_and_Results.md`
- **Chapter 5:** `report/CHAPTER_5_Conclusion_and_Recommendations.md`
- Figures/Tables lists: `report/LIST_OF_FIGURES_AND_TABLES.md`
- References to add: `report/REFERENCES_TO_ADD.md`
- Appendices scaffold: `report/appendices/APPENDICES_SCAFFOLD.md`
