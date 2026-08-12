# Figure 4.1 — Framework Architecture

> **Paste instruction:** Render this Mermaid diagram (GitHub, VS Code, mermaid.live, or export to PNG/SVG) and insert as **Figure 4.1** in Chapter 4, Section 4.12.  
> Leave a blank figure slot in the Word report: `[INSERT FIGURE 4.1: Framework Architecture]`

## Mermaid (system architecture)

```mermaid
flowchart TB
    subgraph INPUT["1. Data Layer"]
        DS["IBM HR Analytics Dataset<br/>1,470 employees · 35 features"]
        EDA["Exploratory Data Analysis<br/>Distribution · Correlation"]
    end

    subgraph PREP["2. Preprocessing Layer"]
        CLN["Cleaning<br/>Drop ID / constants"]
        ENC["Encoding<br/>One-Hot + Label"]
        SCL["Scaling<br/>StandardScaler"]
        SPL["Stratified Split<br/>80% Train / 20% Test"]
        SMT["SMOTE<br/>Training set only"]
    end

    subgraph MODEL["3. Predictive Modelling Layer"]
        DT["Decision Tree<br/>Baseline"]
        RF["Random Forest<br/>Ensemble"]
        XGB["XGBoost<br/>Selected best model"]
        EVAL["Evaluation<br/>Acc · Prec · Rec · F1 · ROC-AUC · CV"]
    end

    subgraph XAI["4. Explainability Layer"]
        SHAPG["SHAP Global<br/>Summary · Bar · Dependence"]
        SHAPL["SHAP Local<br/>Waterfall"]
        LIME["LIME Local<br/>Case explanations"]
        AUDIT["SHAP–LIME Consistency Audit"]
    end

    subgraph DSS["5. Decision Support Layer"]
        RISK["Risk Score & Level<br/>High / Moderate / Low"]
        REC["Managerial Recommendations<br/>Workload · Pay · Engagement"]
        RPT["Managerial Decision Report<br/>Printable action plan"]
        UI["SME Manager Dashboard<br/>Web + FastAPI inference"]
    end

    DS --> EDA --> CLN --> ENC --> SCL --> SPL --> SMT
    SMT --> DT & RF & XGB
    DT & RF & XGB --> EVAL
    EVAL -->|Best model: XGBoost| XGB
    XGB --> SHAPG & SHAPL & LIME
    SHAPG & SHAPL & LIME --> AUDIT
    AUDIT --> RISK --> REC --> RPT --> UI
```

## Mermaid (end-to-end inference flow for one employee)

```mermaid
sequenceDiagram
    participant M as SME Manager
    participant UI as Web Dashboard
    participant API as FastAPI Backend
    participant XGB as XGBoost Model
    participant SHAP as SHAP Explainer
    participant ENG as Recommendation Engine

    M->>UI: Enter / select employee attributes
    UI->>API: POST /predict
    API->>XGB: Preprocess + predict attrition probability
    XGB-->>API: Risk score + class
    API->>SHAP: Local feature attributions
    SHAP-->>API: Top risk / retention drivers
    API->>ENG: Map drivers to actions
    ENG-->>API: Prioritised recommendations
    API-->>UI: Risk gauge + SHAP + LIME + report
    UI-->>M: Transparent decision support output
```

## Caption (for Word)

**Figure 4.1:** Architecture of the proposed Explainable AI (XAI) framework for managerial decision-making in SMEs. The pipeline integrates data preprocessing, multi-model prediction, dual SHAP/LIME explainability, and a managerial decision-support reporting layer.
