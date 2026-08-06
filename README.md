# Explainable AI (XAI) Framework for Managerial Decision-Making in SMEs

An end-to-end Explainable AI framework for SME managerial decision support, demonstrated on **employee attrition** using the IBM HR Analytics dataset. The system predicts attrition risk with XGBoost and explains every prediction with **SHAP** and **LIME**, then translates the explanations into prioritised, plain-language retention actions for managers.

## Architecture

```
Raw HR data
   │  preprocessing (preprocessor.pkl)
   ▼
Decision Tree / Random Forest / XGBoost  ── best model: XGBoost (xgb_model.pkl)
   │
   ├── SHAP (global + local explanations)
   ├── LIME (local case explanations)
   └── Recommendation engine (backend/recommendations.py)
   │
   ▼
FastAPI backend  ──  Next.js manager dashboard
(localhost:8000)    (localhost:3000)
```

| Layer | Deliverable | Location |
|-------|-------------|----------|
| Experimentation | Full ML + XAI notebook | `XAI_Bus.ipynb` |
| Best model | XGBoost classifier | `xgb_model.pkl` |
| Preprocessing | ColumnTransformer pipeline | `preprocessor.pkl` |
| Features | 46 engineered feature names | `feature_names.pkl` |
| Explainability | Tree SHAP explainer | `shap_explainer.pkl` |
| Metrics | Test + CV results | `model_performance.csv`, `metrics/` |
| Error analysis | Per-employee outcomes | `reports/` |
| Figures | Confusion, ROC, SHAP, LIME, ... | `figures/` |
| Inference API | FastAPI prediction + SHAP + recommendations | `backend/` |
| Manager UI | Next.js decision dashboard | `web/` |
| Report | Chapters 4–5, figures, tables, appendices | `report/` |

## Prerequisites

- Python 3.13+
- Node.js 20+ and npm
- Git (for the repo; not required to run)

## Setup

### 1. Backend (Python)

```powershell
# Create and activate the virtual environment (first time only)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: pin scikit-learn to 1.6.1 — preprocessor.pkl was pickled with
# this version. Newer versions remove internals (e.g. _RemainderColsList)
# required to unpickle it, and the API will fail to load the model.
pip install "scikit-learn==1.6.1"
```

### 2. Frontend (Node.js)

```powershell
cd web
npm install
cd ..
```

## Running the system

### Option A — one-click (recommended)

```powershell
.\start.bat
```

This opens two windows: the FastAPI backend on `http://localhost:8000` and the Next.js frontend on `http://localhost:3000`.

### Option B — manual

```powershell
# Terminal 1: backend
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000

# Terminal 2: frontend
cd web
npm run dev
```

## Using the system

- **Dashboard:** http://localhost:3000 — select a preset case (high/moderate/low risk) or enter employee attributes, then view risk gauge, SHAP waterfall, LIME rules and the managerial action plan.
- **API docs (Swagger):** http://localhost:8000/docs
- **Health check:** http://localhost:8000/api/health
- **Legacy static UI:** http://localhost:8000/ (served directly by the backend from `frontend/`)

The frontend calls `POST http://localhost:8000/api/predict` for real model predictions. If the backend is not running, it automatically falls back to a client-side simulation (`web/src/lib/data.ts`) so the UI always remains usable.

## Key endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Model load status and feature count |
| `/api/predict` | POST | Attrition probability, risk level, SHAP waterfall, LIME-style rules, recommendations |
| `/api/presets` | GET | Built-in employee case studies |
| `/api/global-explain` | GET | Model comparison metrics and global drivers |

## Retraining

See `backend/retrain_local.py` for a local retraining script, or run the full pipeline in `XAI_Bus.ipynb` (Google Colab / Jupyter).

## Dissertation report

The written deliverables live in `report/`:

- `report/CHAPTER_4_System_Implementation_and_Results.md` — implementation and results
- `report/CHAPTER_5_Conclusion_and_Recommendations.md` — conclusion and recommendations
- `report/Chapters_4_and_5_System_Implementation_Results_and_Conclusion.docx` — Word build (all tables + embedded figures)
- `report/LIST_OF_FIGURES_AND_TABLES.md` — figure/table registry
- `report/REFERENCES_TO_ADD.md` — references to merge into the main reference list

Rebuild the Word document after changing figures:

```powershell
.\.venv\Scripts\python.exe build_chapters_4_5_docx.py
```

## Project structure

```
backend/          FastAPI inference API, recommendation engine, retraining scripts
frontend/         Legacy static HTML/JS UI (served by the backend at :8000)
web/              Next.js manager dashboard (primary UI at :3000)
figures/          All report figures (ROC, confusion, SHAP, LIME, ...)
metrics/          Cross-validation and feature importance CSVs
reports/          Error analysis and misclassified-employee exports
report/           Dissertation chapters 4–5, tables, appendices, docx build
*.pkl             Serialised model artefacts (model, preprocessor, explainer)
```

## Key results (held-out test set, n = 294)

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|-------|----------|-----------|--------|-----|---------|
| Decision Tree | 0.7857 | 0.3261 | 0.3191 | 0.3226 | 0.5968 |
| Random Forest | 0.8401 | 0.5000 | 0.2128 | 0.2985 | 0.7805 |
| **XGBoost** | **0.8776** | **0.7200** | **0.3830** | **0.5000** | **0.8041** |

Strongest attrition driver: **overtime** (top in both gain-based importance and SHAP).
