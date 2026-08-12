# Dissertation Report Pack (Chapters 4–5 + Supporting Materials)

This folder completes the **written** side of the XAI SME dissertation. Chapters 1–3 already exist in the main Word draft; paste Chapters 4–5 from the markdown files below.

## Quick start (what to do next)

1. Open **`CHAPTER_4_System_Implementation_and_Results.md`** → copy into Word after Chapter 3.  
2. Open **`CHAPTER_5_Conclusion_and_Recommendations.md`** → copy after Chapter 4.  
3. For every `[INSERT FIGURE …]` block, paste the matching image from `../figures/` or render Mermaid.  
4. Fill **Table 4.10 / 4.11** SHAP magnitudes and LIME weight lists from your notebook run outputs.  
5. Merge **`REFERENCES_TO_ADD.md`** into the main reference list.  
6. Attach appendices using **`appendices/APPENDICES_SCAFFOLD.md`**.  
7. Build **List of Figures / Tables** from **`LIST_OF_FIGURES_AND_TABLES.md`**.

## Files in this folder

| File | Purpose |
|------|---------|
| `CHAPTER_4_System_Implementation_and_Results.md` | Full Chapter 4 (results from real metrics) |
| `CHAPTER_5_Conclusion_and_Recommendations.md` | Full Chapter 5 |
| `LIST_OF_FIGURES_AND_TABLES.md` | LOF / LOT with file mapping |
| `REFERENCES_TO_ADD.md` | XGBoost, RF, DT, SMOTE, Kaggle, etc. |
| `IMPLEMENTATION_SUMMARY.md` | One-page status of the build |
| `figures/framework_architecture.md` | Mermaid architecture (Figure 4.1) |
| `tables/comparative_feature_importance.md` | Model gain vs weight vs SHAP narrative |
| `tables/decision_support_example.md` | High/mod/low risk decision examples |
| `appendices/APPENDICES_SCAFFOLD.md` | Appendices A–G checklist |

## Image placeholders (paste these)

| Placeholder | File |
|-------------|------|
| Fig 4.1 Architecture | Export Mermaid from `figures/framework_architecture.md` |
| Fig 4.2 Distribution | Create/export attrition bar |
| Fig 4.3 Correlation | Create/export heatmap |
| Fig 4.4 ROC | `../figures/roc_curve_comparison.png` |
| Fig 4.5 Confusion | `../figures/confusion_matrix.png` |
| Fig 4.6 Threshold / PR | `../figures/threshold_optimization.png` |
| Fig 4.7 Feature importance | `../figures/feature_importance.png` |
| Fig 4.8 Error outcomes | `../figures/error_analysis.png` |
| Fig 4.9 SHAP summary | `../figures/shap_summary_plot.png` |
| Fig 4.11 SHAP dependence | `../figures/shap_dependence_plot.png` |
| Fig 4.12 SHAP waterfall | `../figures/shap_waterfall_sample.png` |
| Fig 4.13–4.15 LIME | `../figures/lime_case_1.png` … `_3.png` |
| Fig 4.16 Dashboard | Screenshot of web UI |

## Progress (updated)

| Component | Status |
|-----------|--------|
| Chapter 1–3 (main docx) | ✅ Complete (~95–100%) |
| Notebook + models + figures | ✅ ~95% |
| **Chapter 4 text** | ✅ **Draft complete in this folder** |
| **Chapter 5 text** | ✅ **Draft complete in this folder** |
| References extras | ✅ Checklist ready |
| Appendices | ✅ Scaffold ready |
| Paste figures into Word | ⏳ Your final assembly step |

**Overall:** implementation + draft write-up of remaining chapters are in place. Final marks-facing step is **Word assembly** (paste text, images, refs, appendices, page numbers, abstract/TOC if required).
