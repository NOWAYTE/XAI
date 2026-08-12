# CHAPTER FOUR: SYSTEM IMPLEMENTATION AND RESULTS

## 4.1 Introduction

This chapter presents the implementation and empirical evaluation of the proposed Explainable Artificial Intelligence (XAI) framework for enhancing managerial decision-making in small and medium enterprises (SMEs). Whereas Chapter Three specified the research design, data source, machine learning models, explainability techniques and evaluation metrics, the present chapter reports what was actually built, measured and interpreted.

The implementation follows the experimental pipeline developed in the project notebook (`XAI_Bus.ipynb`) and operationalised through saved model artefacts, evaluation reports, visualisations, a FastAPI inference service and a managerial decision-support dashboard. The chapter is organised to mirror that pipeline: implementation environment; dataset and preprocessing; exploratory analysis; model development and evaluation; feature importance and error analysis; SHAP and LIME explainability; the decision-support framework; and a discussion of findings against the research objectives and questions.

All quantitative results reported below are taken from the held-out test evaluation, cross-validation outputs and explainability artefacts generated during implementation. Figure placeholders indicate where images from the `figures/` folder (or Mermaid exports) should be pasted into the final Word document.

---

## 4.2 Implementation Environment

The framework was implemented in **Python** within an interactive **Jupyter / Google Colab** environment to support rapid experimentation, visualisation and artefact export. Core libraries used were:

| Library / tool | Purpose |
|----------------|---------|
| Pandas, NumPy | Data loading, cleaning and numerical operations |
| Scikit-learn | Preprocessing, train–test split, Decision Tree, Random Forest, metrics, cross-validation |
| imbalanced-learn (SMOTE) | Mitigation of class imbalance on the training set only |
| XGBoost | Gradient boosting classification (selected production model) |
| SHAP | Global and local model explanations (TreeExplainer) |
| LIME | Local, model-agnostic case explanations |
| Matplotlib / Seaborn | Statistical and diagnostic plots |
| Joblib / Pickle | Persistence of preprocessor, model, feature names and explainer |
| FastAPI (deployment layer) | Real-time inference and explanation API |
| Next.js (deployment layer) | SME manager–facing decision dashboard |

Reproducibility was supported by fixing `random_state=42` for the stratified split, SMOTE and model initialisation, and by exporting all major artefacts to a structured project directory (`figures/`, `metrics/`, `reports/`, and serialised `.pkl` files). The same trained XGBoost model and preprocessor underpin both the offline evaluation reported in this chapter and the online decision-support prototype.

**Key hyperparameters (summary)** are listed in Table 4.1; full detail is provided in Appendix C.

**Table 4.1: Summary of model and pipeline hyperparameters**

| Component | Setting |
|-----------|---------|
| Train–test split | 80% / 20%, stratified, `random_state=42` |
| SMOTE | Applied to training data only, `random_state=42` |
| Decision Tree | Default scikit-learn settings, `random_state=42` |
| Random Forest | `n_estimators=100`, `random_state=42` |
| XGBoost | `n_estimators=100`, `learning_rate=0.1`, `eval_metric='logloss'`, `random_state=42` |
| Cross-validation | 5-fold StratifiedKFold, scoring = F1 |
| LIME | Tabular explainer, top 5 local features per case |
| SHAP | `TreeExplainer` on best model; sample of test instances for global plots |

---

## 4.3 Dataset Description

The empirical study uses the **IBM HR Analytics Employee Attrition and Performance** dataset, a publicly available benchmark on Kaggle that is widely used for workforce analytics and binary classification research. The dataset is synthetic but designed to reflect realistic organisational attributes, which makes it suitable for methodological demonstration without exposing real employee identities (Ofem, 2024; ethical considerations in Chapter Three).

**Table 4.2: Dataset characteristics**

| Characteristic | Description |
|----------------|-------------|
| Number of observations | 1,470 employees |
| Number of variables (raw) | 35 features |
| Format | CSV |
| Target variable | Attrition (Yes / No → encoded 1 / 0) |
| Missing values | None reported in the source file |
| Learning problem | Binary classification |
| Source | Kaggle – IBM HR Analytics Employee Attrition Dataset |

Predictor variables span demographic factors (e.g. age, gender, marital status, education), job and organisational factors (e.g. department, job role, job level, overtime, business travel), compensation (e.g. monthly income, stock option level, salary hike), satisfaction and engagement (e.g. job, environment, relationship satisfaction, work–life balance), and tenure (e.g. years at company, years in current role, years with current manager). The dependent variable **Attrition** indicates whether the employee left the organisation.

Although the case domain is human resource attrition, the XAI framework—predict, explain, recommend—is designed to generalise to other SME managerial decision problems where tabular organisational data and trust in AI recommendations are critical.

**Dataset citation (to include in References):**  
Pavansubhash (n.d.) *IBM HR Analytics Employee Attrition & Performance*. Kaggle. Available at: https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset

---

## 4.4 Data Preprocessing

Preprocessing prepared the raw dataset for supervised learning while preserving interpretability of features for SHAP and LIME.

### 4.4.1 Cleaning and target encoding

- **Dropped** non-informative or constant fields: `EmployeeNumber` (identifier) and `Over18` (constant).
- **Encoded** the target: `Attrition` mapped as Yes → 1, No → 0.
- Separated features (**X**) from the target (**y**).
- Identified **categorical** (object) and **numerical** (int/float) columns for differential treatment in the pipeline.

### 4.4.2 Feature transformation pipeline

A scikit-learn `ColumnTransformer` was fitted on the training fold only:

- **Numerical features:** `StandardScaler` (zero mean, unit variance).
- **Categorical features:** `OneHotEncoder` with `drop='first'` to reduce dummy-variable collinearity, producing a final feature space of **46** columns after encoding.

### 4.4.3 Train–test split and class imbalance

- Data were split **80% training / 20% testing** with **stratification** on Attrition so that class proportions were preserved in both sets.
- The test set size used in evaluation was **n = 294** employees.
- Because attrition is a minority class, **SMOTE** (Synthetic Minority Over-sampling Technique) was applied **only to the training data** after preprocessing, avoiding information leakage into the test set (Chawla et al., 2002).

Saved artefacts for later inference included `preprocessor.pkl` and `feature_names.pkl`.

**Table 4.3: Preprocessing outcomes (conceptual summary)**

| Stage | Outcome |
|-------|---------|
| Raw shape | 1,470 × 35 (approx.) |
| After drop of ID/constants | Reduced feature set; target encoded |
| After one-hot + scaling | 46 model features |
| Split | Stratified 80/20 |
| SMOTE | Training distribution rebalanced; test left natural |

This pipeline matches the methodology in Chapter Three and is the same transformation path used by the live inference API.

---

## 4.5 Exploratory Data Analysis

Exploratory data analysis (EDA) confirmed data quality and motivated modelling choices.

### 4.5.1 Class distribution

Attrition is **imbalanced**: most employees are stayers (Attrition = 0), and a minority are leavers (Attrition = 1). This imbalance justifies (a) reporting precision, recall, F1 and ROC-AUC rather than accuracy alone, and (b) using SMOTE on the training set.

```
[INSERT FIGURE 4.2: Dataset Distribution — Employee Attrition bar chart]
Source: notebook EDA cell / export attrition counts plot
Caption: Figure 4.2 Distribution of employee attrition in the IBM HR dataset, showing class imbalance between stayers and leavers.
```

### 4.5.2 Data quality checks

Dataset information, descriptive statistics, missing-value checks and duplicate counts were inspected. The source data presented **no missing values** and **no duplicate rows** in the cleaned working frame, reducing the need for imputation and supporting reliable benchmarking.

### 4.5.3 Correlation structure

A correlation matrix of numerical predictors was examined to understand linear associations (e.g. among tenure, income and job level). Strong correlations among related tenure/compensation variables are expected in HR data and are handled naturally by tree ensembles, which can split on interacting features without assuming feature independence.

```
[INSERT FIGURE 4.3: Correlation Matrix of numerical features]
Source: notebook correlation heatmap / figures export
Caption: Figure 4.3 Correlation matrix of numerical predictors in the attrition dataset.
```

EDA therefore supported the choice of tree-based models and dual explainability rather than linear models alone.

---

## 4.6 Model Development

Three supervised classifiers were trained on the SMOTE-resampled training matrix and compared on the **untouched** stratified test set:

1. **Decision Tree** — transparent baseline; hierarchical if–then structure.  
2. **Random Forest** — bagged ensemble of trees; improved stability (Breiman, 2001).  
3. **XGBoost** — gradient-boosted trees optimising residual error iteratively (Chen and Guestrin, 2016).

All models used a fixed random seed. After training, predicted class labels and predicted attrition **probabilities** were generated for every test employee. The model with the highest **ROC-AUC** on the test set was designated the best model for explainability and decision support; this was **XGBoost**, which was serialised as `xgb_model.pkl`.

The development step deliberately separates **prediction** (model layer) from **explanation** (XAI layer), consistent with post-hoc, model-agnostic and model-specific explanation practice in the XAI literature (Arrieta et al., 2020; Lundberg and Lee, 2017; Ribeiro, Singh and Guestrin, 2016).

---

## 4.7 Model Evaluation

### 4.7.1 Hold-out test performance

**Table 4.4: Model performance comparison on the held-out test set (n = 294)**

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|-------|----------|-----------|--------|----------|---------|
| Decision Tree | 0.7857 | 0.3261 | 0.3191 | 0.3226 | 0.5968 |
| Random Forest | 0.8401 | 0.5000 | 0.2128 | 0.2985 | 0.7805 |
| **XGBoost** | **0.8776** | **0.7200** | **0.3830** | **0.5000** | **0.8041** |

**Source:** `model_performance.csv`

**Interpretation.**  
XGBoost achieved the best overall discrimination (**ROC-AUC = 0.8041**) and the highest **precision (0.72)** and **F1 (0.50)** among the three models. Accuracy alone would overstate Decision Tree quality given imbalance; Random Forest improved accuracy and AUC relative to the tree but produced low recall (0.21), missing many true leavers. XGBoost still shows **modest recall (0.38)**, which is discussed under error analysis and limitations: in retention settings, false negatives (missed leavers) carry high managerial cost.

### 4.7.2 Cross-validation

**Table 4.5: Five-fold stratified cross-validation (F1 on SMOTE-resampled training data)**

| Model | Mean F1 | Std Dev |
|-------|---------|---------|
| Decision Tree | 0.8549 | 0.0174 |
| Random Forest | 0.9323 | 0.0112 |
| XGBoost | 0.9270 | 0.0073 |

**Source:** `metrics/cross_validation_results.csv`

Cross-validation F1 is high for the ensembles, with Random Forest slightly ahead of XGBoost on mean F1 and XGBoost showing the **lowest variance**. Slight differences between CV F1 and test F1 are expected because CV was scored on resampled training folds, whereas Table 4.4 reflects the natural (imbalanced) test distribution. Final model selection therefore prioritised **test ROC-AUC and precision–recall behaviour** relevant to deployment.

### 4.7.3 ROC curves

```
[INSERT FIGURE 4.4: ROC Curve Comparison]
File: figures/roc_curve_comparison.png
Caption: Figure 4.4 ROC curves for Decision Tree, Random Forest and XGBoost on the held-out test set. The diagonal represents random classification.
```

The ROC plot visually confirms superior separation for XGBoost and Random Forest relative to the single Decision Tree.

### 4.7.4 Confusion matrix (best model)

```
[INSERT FIGURE 4.5: Confusion Matrix — XGBoost]
File: figures/confusion_matrix.png
Caption: Figure 4.5 Confusion matrix for the selected XGBoost model on the test set.
```

**Table 4.6: Confusion counts for XGBoost (default decision threshold)**

| Outcome | Count | Meaning |
|---------|-------|---------|
| True Negative (TN) | 240 | Correctly predicted stayers |
| True Positive (TP) | 18 | Correctly predicted leavers |
| False Negative (FN) | 29 | Leavers predicted as stayers (missed risk) |
| False Positive (FP) | 7 | Stayers predicted as leavers (false alarm) |
| **Total** | **294** | Full test set |

### 4.7.5 Precision–recall and threshold sensitivity

Default classification uses probability threshold 0.5. Because attrition is rare, the notebook also examined the **precision–recall trade-off** and an F1-maximising threshold.

```
[INSERT FIGURE 4.6: Precision–Recall / Threshold Optimisation]
File: figures/threshold_optimization.png
Caption: Figure 4.6 Precision and recall as functions of the classification threshold, with the F1-optimal threshold highlighted.
```

Threshold tuning allows SME managers (or HR policy) to favour **higher recall** (catch more potential leavers, more false alarms) or **higher precision** (fewer false alarms, more missed leavers). The decision-support interface can expose risk **bands** (high / moderate / low) rather than a single hard label, which better matches managerial use.

---

## 4.8 Feature Importance

Built-in tree importance provides a first global view of which encoded features the models rely on.

```
[INSERT FIGURE 4.7: Feature Importance — DT, RF, XGBoost (Top 15)]
File: figures/feature_importance.png
Caption: Figure 4.7 Top-15 feature importances for Decision Tree, Random Forest and XGBoost.
```

For the selected **XGBoost** model, **gain-based** importance (average loss reduction when a feature is used) ranked as follows (top 10):

**Table 4.7: XGBoost gain-based feature importance ranking (Top 10)**

| Rank | Feature (pipeline name) | Manager-readable label | Gain |
|------|-------------------------|------------------------|------|
| 1 | `cat__OverTime_Yes` | Works overtime | 31.68 |
| 2 | `num__JobLevel` | Job level | 15.24 |
| 3 | `num__StockOptionLevel` | Stock option level | 11.74 |
| 4 | `cat__BusinessTravel_Travel_Frequently` | Travels frequently | 9.48 |
| 5 | `cat__MaritalStatus_Single` | Single | 8.11 |
| 6 | `cat__EducationField_Medical` | Education field: Medical | 7.70 |
| 7 | `num__TotalWorkingYears` | Total working years | 7.68 |
| 8 | `cat__JobRole_Sales Executive` | Sales Executive role | 6.76 |
| 9 | `cat__JobRole_Laboratory Technician` | Laboratory Technician role | 6.63 |
| 10 | `cat__JobRole_Research Scientist` | Research Scientist role | 6.37 |

**Source:** `metrics/xgb_gain_importance.csv` / model booster gain scores.

**Split-weight** importance (how often a feature is used) instead emphasised continuous variables such as **MonthlyIncome**, **Age**, **DailyRate** and **DistanceFromHome**. This difference is expected: frequency of splits is not identical to average gain. The dissertation therefore does not treat a single importance ranking as definitive; **SHAP** (Section 4.10) supplies an attribution view aligned with individual predictions, which is more suitable for managerial communication.

**Table 4.8: Comparative view — model-centric vs explanation-centric importance**

| Perspective | What it answers | Primary artefacts |
|-------------|-----------------|-------------------|
| Gain / MDI importance | Which features improve splits most / are used by the ensemble? | Figure 4.7, Table 4.7 |
| SHAP mean \|value\| | Which features move predictions most, on average? | Figure 4.9, Table 4.10 |
| LIME local weights | Which features explain *this* employee? | Figures 4.13–4.15 |

A fuller comparative table is provided in `report/tables/comparative_feature_importance.md` and Appendix E.

---

## 4.9 Error Analysis

Error analysis examines *who* is misclassified and why that matters for SME managers.

```
[INSERT FIGURE 4.8: Prediction Outcome Counts]
File: figures/error_analysis.png
Caption: Figure 4.8 Counts of true positives, true negatives, false positives and false negatives for XGBoost on the test set.
```

**Table 4.9: Outcome summary (XGBoost test set)**

| Prediction outcome | Count | Share of test set |
|--------------------|-------|-------------------|
| True Negative | 240 | 81.6% |
| False Negative | 29 | 9.9% |
| True Positive | 18 | 6.1% |
| False Positive | 7 | 2.4% |

**Source:** `reports/error_analysis.csv`

### Patterns observed

- **True positives (correctly flagged leavers)** were strongly associated with **OverTime = Yes** (16 of 18) and relatively **lower mean monthly income** (~3,773) and younger mean age (~32), with many **single** employees.  
- **False negatives (missed leavers)** mixed overtime and non-overtime cases; mean income was higher than TPs (~5,045) and mean age higher (~38). These employees may leave for subtler reasons not fully captured by the strongest global drivers—precisely where local XAI and human judgement remain essential.  
- **False positives** were few (7); mean income was moderate-low (~4,113) and mean age lower (~29). False alarms waste managerial attention but are less costly than undetected attrition in many SME contexts.

Full misclassified rows are archived in `reports/misclassified_employees.csv` (Appendix D/G). Error analysis therefore motivates **threshold policies**, **human-in-the-loop** review of borderline probabilities, and **local explanations** before high-stakes retention actions.

---

## 4.10 SHAP Analysis

SHAP (SHapley Additive exPlanations) attributes the model’s prediction to features using principles from cooperative game theory (Lundberg and Lee, 2017). A `TreeExplainer` was fitted to the trained XGBoost model. Global plots used a sample of processed test instances; local waterfall plots explained individual employees.

### 4.10.1 Global SHAP summary

```
[INSERT FIGURE 4.9: SHAP Summary Plot]
File: figures/shap_summary_plot.png
Caption: Figure 4.9 SHAP summary (beeswarm) plot for the XGBoost attrition model. Each point is an employee-feature attribution; colour indicates feature value.
```

```
[INSERT FIGURE 4.10: SHAP Bar Plot — mean |SHAP| global importance]
File: figures/shap_bar_plot.png
Caption: Figure 4.10 Global SHAP feature importance (mean absolute SHAP value).
```

**Table 4.10: Top global attrition drivers (SHAP)**

**Source:** notebook Cell 18 — mean absolute SHAP values over sampled test instances (log-odds scale).

| Rank | Feature (pipeline name) | Manager-readable label | Mean \|SHAP\| |
|------|-------------------------|------------------------|---------------|
| 1 | `cat__OverTime_Yes` | Works overtime | 0.9869 |
| 2 | `num__StockOptionLevel` | Stock option level | 0.5120 |
| 3 | `cat__BusinessTravel_Travel_Frequently` | Travels frequently | 0.3364 |
| 4 | `num__NumCompaniesWorked` | Number of companies worked | 0.3147 |
| 5 | `num__JobSatisfaction` | Job satisfaction | 0.2956 |
| 6 | `num__MonthlyIncome` | Monthly income | 0.2924 |
| 7 | `num__Age` | Age | 0.2884 |
| 8 | `num__YearsWithCurrManager` | Years with current manager | 0.2849 |
| 9 | `num__DistanceFromHome` | Distance from home | 0.2638 |
| 10 | `num__EnvironmentSatisfaction` | Environment satisfaction | 0.2442 |

Overtime is by far the strongest global driver (mean |SHAP| ≈ 0.99, roughly double the next feature), followed by a cluster of compensation, tenure and satisfaction attributes. This ranking reconciles the gain-based view (Table 4.7) with the split-weight view: categorical risk switches (overtime, travel, stock options) and continuous HR variables (income, age, tenure) both matter, but attribution-based SHAP puts **overtime** clearly first, which is directly communicable to managers.

### 4.10.2 SHAP dependence

```
[INSERT FIGURE 4.11: SHAP Dependence Plot — Monthly Income]
File: figures/shap_dependence_plot.png
Caption: Figure 4.11 SHAP dependence plot for Monthly Income, showing how income levels relate to attributed attrition risk, possibly interacting with other features.
```

Dependence plots help managers see **non-linear** effects (e.g. low income associated with higher risk attributions) rather than a single coefficient.

### 4.10.3 Local SHAP waterfall

```
[INSERT FIGURE 4.12: SHAP Waterfall — sample employee]
File: figures/shap_waterfall_sample.png
Caption: Figure 4.12 SHAP waterfall plot for a single test employee, decomposing the prediction from the base value through feature contributions.
```

Waterfall plots operationalise “glass box” communication (Rai, 2020): the manager sees *why this score*, not only *what score*.

---

## 4.11 LIME Analysis

LIME explains individual predictions by fitting a simple local surrogate around the instance (Ribeiro, Singh and Guestrin, 2016). A `LimeTabularExplainer` was trained on the SMOTE-resampled training matrix with class names `No Attrition` / `Attrition`. Three test cases were explained with the top five local features each.

```
[INSERT FIGURE 4.13: LIME Local Explanation — Case 1]
File: figures/lime_case_1.png
Caption: Figure 4.13 LIME explanation for Case 1.
```

```
[INSERT FIGURE 4.14: LIME Local Explanation — Case 2]
File: figures/lime_case_2.png
Caption: Figure 4.14 LIME explanation for Case 2.
```

```
[INSERT FIGURE 4.15: LIME Local Explanation — Case 3]
File: figures/lime_case_3.png
Caption: Figure 4.15 LIME explanation for Case 3.
```

**Table 4.11: LIME case comparison (top five local features per case)**

**Source:** notebook LIME printouts (cell 16); weights are local surrogate regression coefficients (positive → toward attrition, negative → toward stay).

| Case | Predicted class | Top local factors (LIME weights) | Managerial reading |
|------|-----------------|----------------------------------|--------------------|
| 1 | Stay | No overtime (−0.127); no frequent travel (−0.067); female (−0.034); R&D department (+0.033); not a Laboratory Technician (−0.027) | Low-risk profile: absence of the two strongest risk switches (overtime, frequent travel) dominates; routine monitoring only |
| 2 | Stay | Overtime (+0.120); no frequent travel (−0.067); higher monthly income (−0.055); no stock options (+0.030); not a Laboratory Technician (−0.029) | Borderline monitor case: overtime and missing stock options raise risk, but income and travel profile pull the other way |
| 3 | Stay | No overtime (−0.124); no frequent travel (−0.067); no stock options (+0.031); female (−0.030); not a Laboratory Technician (−0.030) | Low-risk profile similar to Case 1; stock-option gap is the only material upward driver |

In all three sampled cases the local explanations are dominated by the same two factors that lead the global rankings—**overtime** and **frequent business travel**—illustrating that the local and global views of the model are mutually consistent. Cases 2 shows how LIME surfaces a genuinely mixed profile (overtime risk offset by income and travel factors), which is precisely the situation where a manager should review the employee before acting.

### SHAP–LIME consistency audit

For selected samples, feature-level SHAP values were compared with LIME weights (notebook audit cells). Perfect numerical equality is not expected—methods differ—but **directional agreement** on major drivers increases confidence that explanations are not arbitrary.

**Table 4.13: SHAP–LIME consistency audit for a sampled test employee (SHAP values vs LIME weights, top 10 features by |SHAP|)**

| Feature | SHAP value | LIME weight |
|---------|------------|-------------|
| Overtime | −1.0895 | −0.1250 |
| Monthly income | +0.8777 | +0.0235 |
| Years with current manager | +0.8657 | +0.0019 |
| Stock option level | −0.7406 | +0.0269 |
| Total working years | +0.6696 | −0.0013 |
| Frequent business travel | −0.4299 | −0.0713 |
| Age | +0.3584 | +0.0143 |
| Job role: Sales Representative | +0.3013 | +0.0016 |
| Environment satisfaction | −0.2599 | −0.0005 |
| Hourly rate | −0.2577 | −0.0049 |

**Source:** notebook audit cells (SHAP values from the model explainer; LIME weights from the local surrogate).

For this sampled employee (a stayer), both methods agree on the dominant driver: **overtime absence pushes strongly toward staying** (SHAP −1.09, LIME −0.125, the largest weight in both). Directional agreement also holds for frequent business travel (−0.43 / −0.07) and for the positive pull of income, tenure and age. A repeat LIME run on the same instance produced near-identical weights (overtime −0.1209 vs −0.1250), showing acceptable local stability for this sample. Residual disagreements on weaker features (e.g. stock option level, sign opposite in LIME) are expected and discussed as a limitation of local surrogates versus game-theoretic SHAP.

Together, SHAP and LIME address Research Question 2: dual explainability improves **transparency** (global + local) and supports **trust** by letting managers cross-check narratives before acting.

---

## 4.12 Decision Support Framework

Prediction and explanation alone do not complete the managerial loop. The proposed framework adds a **decision-support layer** that translates feature attributions into prioritised, plain-language actions for SME managers.

### 4.12.1 Architecture

```
[INSERT FIGURE 4.1: Framework Architecture]
Source: Render Mermaid from report/figures/framework_architecture.md → PNG/SVG
Caption: Figure 4.1 Architecture of the XAI managerial decision-support framework (data → preprocessing → models → SHAP/LIME → recommendations → manager UI).
```

Layers:

1. **Data & preprocessing** — clean, encode, scale, split, SMOTE (train).  
2. **Predictive modelling** — compare DT/RF/XGBoost; deploy best model.  
3. **Explainability** — SHAP global/local + LIME local + optional consistency audit.  
4. **Decision support** — risk score/level, driver lists, recommendation engine, printable managerial report.  
5. **Delivery** — FastAPI backend + web dashboard for interactive use.

### 4.12.2 Recommendation engine

The engine (`backend/recommendations.py`) inspects top positive SHAP drivers and raw employee attributes to emit categorised actions, for example:

| Category | Typical trigger | Example action |
|----------|-----------------|----------------|
| Workload & burnout | OverTime = Yes / high SHAP on overtime | Cap overtime; rebalance workload; flex-time |
| Compensation | Low MonthlyIncome / income SHAP risk | Salary benchmarking; merit review |
| Engagement | Low job/environment satisfaction | Stay interview; role clarity |
| Flexibility & wellbeing | Low work–life balance | Hybrid options; wellbeing check-in |
| Career progression | Long time since promotion | 6-month growth roadmap |
| Financial incentives | Zero stock options + SHAP risk | Equity/bonus programme consideration |
| Retention maintenance | No critical drivers | Continue recognition and regular 1:1s |

### 4.12.3 Managerial decision report

```
[INSERT FIGURE 4.16: Decision Support Framework / Dashboard screenshot]
Source: web UI (Risk gauge, SHAP waterfall, LIME table, Managerial Report)
Caption: Figure 4.16 SME manager dashboard showing risk level, explanations and action plan for a selected employee.
```

**Table 4.12: Decision support example — high-risk preset profile**

| Element | Content |
|---------|---------|
| Profile | Overtime, low pay, low satisfaction, single, no stock options |
| Illustrative attributes | Age 29; Sales Executive; MonthlyIncome 2,450; OverTime Yes; JobSatisfaction 1 |
| Risk band | High / critical (probability above policy threshold) |
| Example actions | Cap overtime; compensation review; stay interview; flexibility options |

*(Full preset table: `report/tables/decision_support_example.md`.)*

This closes the loop from **black-box score** to **accountable managerial action**, aligning with the Technology Acceptance Model (perceived usefulness/ease of use) and Human–AI Trust Theory (transparency and calibrated trust) developed in Chapter Two.

---

## 4.13 Discussion of Results

### 4.13.1 Link to research objectives

| Objective | Evidence in this chapter |
|-----------|--------------------------|
| Analyse AI’s role in SME managerial decisions | Framework positions ML as decision *support*, not replacement; explanations enable judgement |
| Build ML system for business-related suggestions | DT/RF/XGB trained; XGBoost deployed with recommendation engine |
| Apply SHAP and LIME for transparency | Sections 4.10–4.11; dual global/local explanations |
| Test framework for trust and decision quality | Operationalised via transparent reports and actionability; formal user survey remains future work (Ch 5) |

### 4.13.2 Link to research questions

- **RQ1 (perception/use of AI recommendations):** The prototype presents risk, drivers and actions in managerial language, illustrating *how* recommendations can be used; empirical perception measurement was out of scope of the experimental design but is enabled by the artefact.  
- **RQ2 (advantages of SHAP and LIME):** SHAP supplies coherent global and local attributions; LIME supplies quick case narratives; together they improve transparency relative to scores alone.  
- **RQ3 (effectiveness for decision quality):** Higher AUC/precision than baseline tree models, plus actionable explanations, support higher-quality *evidence inputs* to decisions; residual FN rate shows AI must remain advisory.

### 4.13.3 Practical implications for SMEs

1. **Prioritise overtime, compensation and role/level signals** in retention dashboards.  
2. **Use probability bands + explanations**, not binary flags only.  
3. **Review false-negative profiles** manually—quiet leavers may not match the stereotypical high-overtime pattern.  
4. **Keep humans in the loop** for fairness, context and ethics.

### 4.13.4 Limitations of the results

- Dataset is **synthetic IBM HR** data, not a live SME census.  
- **Recall** of attrition remains moderate; cost-sensitive thresholds need business tuning.  
- **No field study** of manager trust was conducted in this implementation phase.  
- LIME explanations can vary with sampling; SHAP is preferred for consistency, with LIME as complement.

---

## 4.14 Chapter Summary

This chapter implemented and evaluated the proposed XAI framework end-to-end. After preprocessing and EDA on the IBM HR attrition dataset, three classifiers were compared; **XGBoost** offered the best test ROC-AUC (0.804) and precision (0.72). Cross-validation confirmed strong ensemble F1. Feature importance, error analysis, SHAP and LIME provided complementary transparency, and a decision-support layer converted attributions into prioritised managerial actions via an API and dashboard.

The findings demonstrate that predictive performance and explainability can be combined in a practical SME-oriented pipeline. Chapter Five summarises contributions, limitations, recommendations and directions for future research.
