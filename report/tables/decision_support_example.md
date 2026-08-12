# Decision Support Example (Section 4.12)

> Paste as **Table 4.x — Decision support example** and optionally screenshot the dashboard as a figure.

## Preset Case 1 — High risk (illustrative managerial report)

| Field | Value |
|-------|--------|
| Profile | Overtime heavy, low salary, single, low job & environment satisfaction |
| Age | 29 |
| Department / Role | Sales / Sales Executive |
| OverTime | Yes |
| MonthlyIncome | 2,450 |
| JobSatisfaction | 1 / 4 |
| EnvironmentSatisfaction | 1 / 4 |
| WorkLifeBalance | 1 / 4 |
| StockOptionLevel | 0 |
| MaritalStatus | Single |

### Expected decision-support outputs

| Component | Example content |
|-----------|-----------------|
| Risk level | **High / Critical** (probability above decision threshold) |
| Top risk drivers (SHAP-style) | OverTime; low Monthly Income; low Job Satisfaction; no stock options; low environment satisfaction |
| Retention catalysts | (If any negative SHAP toward attrition — e.g. remaining tenure factors) |
| Recommendation 1 | **Workload & Burnout (HIGH):** Cap overtime; rebalance projects; offer flex-time |
| Recommendation 2 | **Compensation (HIGH):** Salary benchmarking and merit review |
| Recommendation 3 | **Engagement (HIGH):** Stay interview on role clarity and culture |
| Recommendation 4 | **Flexibility (MEDIUM):** Hybrid options; wellbeing check-in |

## Preset Case 2 — Moderate risk

| Field | Value |
|-------|--------|
| Profile | Frequent travel, moderate income, promotion stagnation |
| Age | 38 |
| OverTime | No |
| BusinessTravel | Travel_Frequently |
| MonthlyIncome | 4,800 |
| YearsSinceLastPromotion | 3 |
| JobSatisfaction | 2 / 4 |

**Manager actions (typical):** monitor travel load; career roadmap within 6 months; engagement check-in.

## Preset Case 3 — Low risk

| Field | Value |
|-------|--------|
| Profile | No overtime, high income, high satisfaction, stock options |
| Age | 42 |
| OverTime | No |
| MonthlyIncome | 8,900 |
| JobSatisfaction | 4 / 4 |
| StockOptionLevel | 2 |

**Manager actions (typical):** maintain recognition and regular 1:1s; no urgent intervention.

## Link to implementation

- Recommendation rules: `backend/recommendations.py`
- UI report component: `web/src/components/ManagerialReport.tsx`
- Presets: `web/src/lib/data.ts`
