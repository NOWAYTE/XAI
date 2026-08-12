# Appendices Scaffold

> Paste each appendix after Chapter 5 / References in the Word dissertation.  
> Keep the main chapters lean; put full dumps here.

---

## Appendix A — Complete Notebook

**Contents:** Full experimental notebook used for preprocessing, modelling, evaluation and XAI.

**How to produce:**
1. Open `XAI_Bus.ipynb`
2. Export to PDF or HTML:  
   `jupyter nbconvert --to pdf XAI_Bus.ipynb`  
   or File → Print in Colab/Jupyter
3. Attach as Appendix A (or link + selected key cells if page limit is tight)

**Caption:** Appendix A presents the complete Jupyter notebook implementing the XAI experimental pipeline.

---

## Appendix B — Source Code

**Contents (curated excerpts recommended):**

| Item | Path |
|------|------|
| Inference API | `backend/main.py` |
| Recommendation engine | `backend/recommendations.py` |
| Managerial report UI | `web/src/components/ManagerialReport.tsx` |
| SHAP waterfall UI | `web/src/components/ShapWaterfall.tsx` |
| LIME table UI | `web/src/components/LimeTable.tsx` |
| Requirements | `requirements.txt` |

**Optional:** Repository tree listing or GitHub URL if permitted by your school.

---

## Appendix C — Hyperparameters

Copy **Table 4.1** and expand:

| Component | Hyperparameters |
|-----------|----------------|
| Train–test split | `test_size=0.2`, `stratify=y`, `random_state=42` |
| StandardScaler | Default |
| OneHotEncoder | `drop='first'`, `sparse_output=False` |
| SMOTE | `random_state=42` (training only) |
| DecisionTreeClassifier | `random_state=42` (other defaults) |
| RandomForestClassifier | `n_estimators=100`, `random_state=42` |
| XGBClassifier | `n_estimators=100`, `learning_rate=0.1`, `use_label_encoder=False`, `eval_metric='logloss'`, `random_state=42` |
| StratifiedKFold | `n_splits=5`, `shuffle=True`, `random_state=42` |
| Cross-val scoring | `f1` |
| SHAP | `TreeExplainer(best_model)`; sample size for global plots as in notebook |
| LIME | `LimeTabularExplainer(...)`, `num_features=5` per case |
| Decision threshold | Default 0.5; F1-optimal from PR curve (report value from notebook Cell 20) |

---

## Appendix D — Performance Metrics

**Include full tables:**

1. `model_performance.csv` — already Table 4.4  
2. `metrics/cross_validation_results.csv` — Table 4.5  
3. Optional: full `classification_report` text from threshold optimisation cell  
4. Confusion counts — Table 4.6  
5. Excerpt of `reports/error_analysis.csv` (first 20 rows) + note full file available  
6. `reports/misclassified_employees.csv` summary count

---

## Appendix E — SHAP Outputs

| Item | File / source |
|------|----------------|
| Summary beeswarm | `figures/shap_summary_plot.png` |
| Dependence (Monthly Income) | `figures/shap_dependence_plot.png` |
| Waterfall sample | `figures/shap_waterfall_sample.png` |
| Top-10 global mean \|SHAP\| table | Notebook Cell 18 |
| Comparative gain vs SHAP discussion | `report/tables/comparative_feature_importance.md` |
| Explainer artefact | `shap_explainer.pkl` (mention only; do not paste binary) |

---

## Appendix F — LIME Outputs

| Item | File |
|------|------|
| Case 1 plot | `figures/lime_case_1.png` |
| Case 2 plot | `figures/lime_case_2.png` |
| Case 3 plot | `figures/lime_case_3.png` |
| Feature–weight lists | Copy printed lists from notebook Cell 16 |
| SHAP–LIME audit table | Notebook Cells 22–23 |

---

## Appendix G — Additional Figures

| Item | Notes |
|------|--------|
| Full feature importance (all models) | `figures/feature_importance.png` if not fully legible in body |
| Error analysis bar chart | `figures/error_analysis.png` |
| Threshold plot | `figures/threshold_optimization.png` |
| UI screenshots (extra states) | High / moderate / low risk presets |
| Architecture sequence diagram | Second Mermaid in `framework_architecture.md` |
| EDA extras | Any additional distributions |

---

## Binding order (suggested)

1. References  
2. Appendix A — Notebook  
3. Appendix B — Source code  
4. Appendix C — Hyperparameters  
5. Appendix D — Metrics  
6. Appendix E — SHAP  
7. Appendix F — LIME  
8. Appendix G — Additional figures  
9. (If required) Glossary / Ethics forms
