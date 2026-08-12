# List of Figures

> Update page numbers after pasting into Word.  
> Files under `figures/` unless noted.

| No. | Title | Section | Source file / notes |
|-----|--------|---------|---------------------|
| **4.1** | Framework architecture of the XAI managerial decision-support system | 4.12 | Render `report/figures/framework_architecture.md` (Mermaid → PNG) |
| **4.2** | Dataset distribution — employee attrition counts | 4.5 | Export from notebook EDA (attrition bar chart) |
| **4.3** | Correlation matrix of numerical predictors | 4.5 | Export from notebook correlation cell |
| **4.4** | ROC curve comparison (Decision Tree, Random Forest, XGBoost) | 4.7 | `figures/roc_curve_comparison.png` |
| **4.5** | Confusion matrix — XGBoost | 4.7 | `figures/confusion_matrix.png` |
| **4.6** | Precision–recall trade-off and optimal threshold | 4.7 | `figures/threshold_optimization.png` |
| **4.7** | Feature importance comparison (top 15 per model) | 4.8 | `figures/feature_importance.png` |
| **4.8** | Prediction outcome counts (TP, TN, FP, FN) | 4.9 | `figures/error_analysis.png` |
| **4.9** | SHAP summary (beeswarm) plot — XGBoost | 4.10 | `figures/shap_summary_plot.png` |
| **4.10** | SHAP bar plot — mean \|SHAP\| global importance | 4.10 | `figures/shap_bar_plot.png` |
| **4.11** | SHAP dependence plot — Monthly Income | 4.10 | `figures/shap_dependence_plot.png` |
| **4.12** | SHAP waterfall plot — sample employee | 4.10 | `figures/shap_waterfall_sample.png` |
| **4.13** | LIME local explanation — Case 1 | 4.11 | `figures/lime_case_1.png` |
| **4.14** | LIME local explanation — Case 2 | 4.11 | `figures/lime_case_2.png` |
| **4.15** | LIME local explanation — Case 3 | 4.11 | `figures/lime_case_3.png` |
| **4.16** | Decision support dashboard / managerial report UI | 4.12 | Screenshot of `web/` app |

### Optional / Appendix figures

| No. | Title | Location |
|-----|--------|----------|
| G.1+ | Additional SHAP/LIME cases, full correlation annotations | Appendix G |
| 2.1 | Conceptual framework (already referenced in Ch 2) | Chapter 2 |

**Expected body figure count:** ~15–16 (matches your planned list: architecture, distribution, correlation, ROC, PR, feature importance, confusion, SHAP summary/bar/dependence, LIME ×3, decision support).

---

# List of Tables

| No. | Title | Section | Source |
|-----|--------|---------|--------|
| **4.1** | Summary of model and pipeline hyperparameters | 4.2 | Notebook + Appendix C |
| **4.2** | Dataset characteristics | 4.3 | Draft Table / Kaggle metadata |
| **4.3** | Preprocessing outcomes | 4.4 | Notebook shapes |
| **4.4** | Model performance comparison (test set) | 4.7 | `model_performance.csv` |
| **4.5** | Five-fold cross-validation F1 results | 4.7 | `metrics/cross_validation_results.csv` |
| **4.6** | Confusion counts — XGBoost | 4.7 | Error analysis |
| **4.7** | XGBoost gain-based feature importance (Top 10) | 4.8 | `metrics/xgb_gain_importance.csv` |
| **4.8** | Comparative importance perspectives (model vs SHAP vs LIME) | 4.8 | `report/tables/comparative_feature_importance.md` |
| **4.9** | Prediction outcome summary | 4.9 | `reports/error_analysis.csv` |
| **4.10** | Top global attrition drivers (SHAP) | 4.10 | Notebook Cell 18 — mean \|SHAP\| magnitudes |
| **4.11** | LIME case comparison | 4.11 | Notebook LIME printouts (cell 16) |
| **4.12** | Decision support example — high-risk profile | 4.12 | `report/tables/decision_support_example.md` |
| **4.13** | SHAP–LIME consistency audit | 4.11 | Notebook audit cells (22/23) |

### Aligns to your planned table list

| Your label | Table no. |
|------------|-----------|
| Dataset Variables / Summary | 4.2, 4.3 |
| Hyperparameters | 4.1 (+ App C) |
| Model Comparison | 4.4 |
| Cross-Validation Results | 4.5 |
| Feature Importance Ranking | 4.7, 4.8 |
| SHAP Ranking | 4.10 |
| LIME Comparison | 4.11 |
| Decision Support Example | 4.12 |
