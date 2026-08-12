# CHAPTER FIVE: CONCLUSION AND RECOMMENDATIONS

## 5.1 Summary of the Study

This dissertation set out to design and validate an Explainable Artificial Intelligence (XAI) framework that makes machine-learning recommendations more transparent, trustworthy and usable for managerial decision-making in small and medium enterprises (SMEs). The work was motivated by a persistent tension in organisational AI: black-box models can deliver useful predictions, yet managers are reluctant to act on outputs they cannot understand or justify to stakeholders (Adadi and Berrada, 2018; Rai, 2020; Arrieta et al., 2020).

The study combined a critical literature review (Chapter Two) with a pragmatic, quantitative experimental methodology (Chapter Three) and a full system implementation (Chapter Four). Using the IBM HR Analytics Employee Attrition dataset as a managerial case, three classifiers—Decision Tree, Random Forest and XGBoost—were trained under a disciplined preprocessing regime (stratified split, scaling, one-hot encoding, SMOTE on training data only). The best-performing model was paired with **SHAP** and **LIME** explanations and embedded in a **decision-support layer** that produces risk levels, feature drivers and plain-language retention actions for SME managers.

Empirically, **XGBoost** achieved the strongest held-out discrimination (**ROC-AUC = 0.8041**, accuracy **0.8776**, precision **0.7200**, F1 **0.5000**), outperforming the Decision Tree baseline and improving on Random Forest’s precision–AUC profile. Global and local explanations highlighted actionable drivers—most notably **overtime**, alongside job level, stock options, travel intensity and related HR factors—while error analysis showed that false negatives remain the principal operational risk. The prototype dashboard and recommendation engine demonstrated how explainability can move from technical plots to managerial reports.

---

## 5.2 Achievement of Objectives

**Objective 1 — Analyse the importance of AI in managerial decision-making in SMEs.**  
Achieved through the literature synthesis and conceptual framing (Chapters One–Two): AI can improve data-driven decisions in resource-constrained SMEs, but adoption is limited by opacity, trust and capability gaps (Troise et al., 2022; Dwivedi et al., 2021). The implemented framework treats AI as decision *support* that augments, rather than replaces, managerial judgement.

**Objective 2 — Build a machine learning system that suggests business-related actions from organisational data.**  
Achieved in Chapter Four: a complete pipeline from raw HR attributes to attrition risk scores, serialised model artefacts, an inference API and a recommendation engine that maps risk drivers to prioritised interventions (workload, compensation, engagement, career, incentives).

**Objective 3 — Apply SHAP and LIME to enhance transparency of AI predictions.**  
Achieved through global SHAP summaries and dependence plots, local SHAP waterfalls, multi-case LIME explanations and a SHAP–LIME consistency audit. Dual explainability provides both workforce-level patterns and employee-level narratives (Lundberg and Lee, 2017; Ribeiro, Singh and Guestrin, 2016).

**Objective 4 — Test the framework’s ability to increase managerial trust and decision quality.**  
Partially achieved in an *artefact* sense: the system operationalises transparency, calibrated risk communication and actionable recommendations—the mechanisms theory links to trust and better decisions (Meske et al., 2022; Glikson and Woolley, 2020; Mohseni, Zarei and Ragan, 2021). A formal field experiment or manager survey measuring trust and decision quality was **not** conducted in this dissertation and is recommended as future work (Section 5.5). Predictive quality was, however, rigorously tested via hold-out metrics, cross-validation, confusion analysis and threshold exploration.

### Research questions — concise answers

| Research question | Answer based on this study |
|-------------------|----------------------------|
| **RQ1** How do SME managers perceive/use AI recommendations? | Literature shows trust and understandability are prerequisites; the prototype shows a usable pattern (risk + explanation + action). Direct manager perception data remain for future empirical work. |
| **RQ2** Advantages of SHAP and LIME for transparency and trust? | SHAP offers consistent global/local attribution; LIME offers accessible case stories; together they reduce black-box opacity and support cross-checking. |
| **RQ3** Effectiveness of the XAI framework for decision quality? | Improved predictive inputs (XGBoost) plus explainable, actionable outputs strengthen the *information quality* of decisions; residual errors mean effectiveness depends on human oversight and threshold policy. |

---

## 5.3 Contributions

### 5.3.1 Theoretical contributions

1. **Integration of TAM and Human–AI Trust Theory with dual XAI.** The conceptual framework (Chapter Two) links explainability (SHAP/LIME) to perceived usefulness, ease of use, transparency and calibrated trust, then traces these to managerial decision quality in SMEs.  
2. **Shift from algorithm-centric to decision-centric XAI evaluation.** Beyond accuracy, the study argues for error costs, local explanations and recommendation quality as part of “effectiveness” in organisational settings (Miller, 2019; Meske et al., 2022).  
3. **SME-focused positioning.** Much XAI research targets healthcare, finance or purely technical benchmarks; this work situates explainability explicitly in SME managerial constraints (resources, accountability, need for plain language).

### 5.3.2 Practical contributions

1. **An end-to-end reference implementation:** preprocessing → multi-model comparison → XGBoost deployment → SHAP/LIME → managerial report.  
2. **Reusable artefacts** (model, preprocessor, metrics, figures) suitable for teaching, pilot projects or extension to other tabular SME decisions (churn, credit risk flags, inventory exceptions—with appropriate domain redesign).  
3. **A decision-support pattern** SMEs can adopt without deep ML expertise: probability bands, top drivers, and prioritised actions rather than raw model dumps.

### 5.3.3 Methodological contributions

Documentation of a **leakage-aware** pipeline (SMOTE on train only), multi-metric evaluation under imbalance, threshold sensitivity, and dual-explanation audit—practices that strengthen master’s-level empirical AI dissertations.

---

## 5.4 Limitations

The following limitations bound the claims of this study:

1. **Synthetic dataset.** The IBM HR attrition data are widely used but not drawn from a specific live SME. External validity to particular industries, countries or firm sizes is limited.  
2. **Single decision domain.** Attrition illustrates the framework; other managerial problems may need different features, costs and legal constraints.  
3. **No primary manager study.** Trust and decision-quality claims are theoretically grounded and artefact-supported, not measured via surveys, experiments or interviews with SME managers.  
4. **Moderate recall.** Even the best model missed a non-trivial share of leavers (29 false negatives on the test set). High precision does not eliminate the need for complementary HR processes.  
5. **Explanation limits.** LIME can be locally unstable; SHAP computational and communicative complexity may still challenge non-technical users without a carefully designed UI.  
6. **Tooling and version drift.** Serialised models depend on library versions; production SMEs would need MLOps practices beyond this research prototype.  
7. **Ethical and legal scope.** Fairness audits, protected-attribute analysis and employment-law compliance were acknowledged but not exhaustively tested.

These limits do not invalidate the framework; they clarify that results are **demonstrative and methodological** rather than universal organisational proof.

---

## 5.5 Recommendations

### 5.5.1 Recommendations for SME managers

- Treat AI attrition (or similar) scores as **decision inputs**, not automatic HR verdicts.  
- Require **explanations** (top drivers) before high-impact actions (exit interviews, pay changes, performance plans).  
- Align **thresholds** with business cost: if losing staff is very expensive, lower the probability cut-off and accept more false alarms.  
- Monitor **overtime, compensation equity, role design and career progression** as recurring structural drivers.  
- Keep **audit logs** of model version, score, explanation and human decision for accountability.

### 5.5.2 Recommendations for AI developers and consultants

- Ship **predict + explain + recommend** together; plots alone rarely change managerial behaviour.  
- Prefer **train-only resampling** and transparent preprocessing pipelines.  
- Expose **probability and uncertainty**, not only class labels.  
- Combine **SHAP (consistency)** with **LIME or simplified narratives (communication)**.  
- Co-design UI language with non-technical users (TAM: ease of use).

### 5.5.3 Recommendations for policymakers and educators

- Encourage **responsible AI literacy** in SME digital programmes, emphasising explainability and human oversight.  
- Support open benchmarks and case studies that connect XAI to real managerial workflows, not only leaderboard accuracy.

---

## 5.6 Future Work

1. **Field evaluation:** controlled studies or pilots with SME managers measuring trust, understanding, time-to-decision and decision quality with vs without explanations.  
2. **Real organisational data:** replicate the pipeline on anonymised live HR or operations data under formal ethics approval.  
3. **Cost-sensitive and fairness-aware learning:** explicit FN/FP costs; disparate impact checks across gender or other attributes where legally appropriate.  
4. **Broader SME domains:** demand forecasting exceptions, micro-credit triage, maintenance risk—same XAI decision pattern.  
5. **Explanation UX research:** which visual forms (waterfall, plain text, counterfactuals) maximise calibrated trust.  
6. **MLOps hardening:** model monitoring, drift detection, retraining protocols suitable for small IT teams.  
7. **Counterfactual explanations:** “what would need to change for this employee to fall below risk threshold?” as a natural extension of SHAP/LIME.

---

## 5.7 Conclusion

Black-box AI is a weak foundation for managerial decisions in SMEs, where accountability, scarce specialist staff and high stakes around people and cash flow make opaque recommendations difficult to trust. This dissertation proposed and implemented an XAI framework that couples competitive predictive performance with SHAP and LIME explainability and a managerial decision-support layer.

Using employee attrition as a worked case, the study showed that **XGBoost** can deliver strong discrimination relative to simpler baselines, that **global and local explanations** surface actionable drivers such as overtime and structural job factors, and that **recommendation logic** can turn attributions into concrete retention actions. In doing so, the work advances a practical path from black-box prediction toward **glass-box decision support** (Rai, 2020)—not by abandoning powerful models, but by wrapping them in transparency, human oversight and SME-appropriate communication.

The hardest technical work—data pipeline, models, metrics, explanations and prototype—is complete. The lasting contribution is the demonstration that explainable, manager-facing AI is feasible for SMEs when methodology, evaluation and interface design are treated as one system. Future research should take this artefact into live organisational settings to measure the trust and decision-quality gains that theory predicts and that this implementation makes possible.
