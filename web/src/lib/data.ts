import { PresetCase, PredictionResponse, EmployeeInput } from './types';

export const PRESETS: Record<string, PresetCase> = {
  case1_high_risk: {
    id: "Employee #453",
    label: "🔥 Case 1: High Risk (#453)",
    description: "Overtime heavy, low salary, single, low job & environment satisfaction.",
    data: {
      Age: 29,
      BusinessTravel: "Travel_Rarely",
      DailyRate: 450,
      Department: "Sales",
      DistanceFromHome: 24,
      Education: 2,
      EducationField: "Marketing",
      EnvironmentSatisfaction: 1,
      Gender: "Female",
      HourlyRate: 45,
      JobInvolvement: 2,
      JobLevel: 1,
      JobRole: "Sales Executive",
      JobSatisfaction: 1,
      MaritalStatus: "Single",
      MonthlyIncome: 2450,
      MonthlyRate: 9800,
      NumCompaniesWorked: 5,
      OverTime: "Yes",
      PercentSalaryHike: 11,
      PerformanceRating: 3,
      RelationshipSatisfaction: 2,
      StockOptionLevel: 0,
      TotalWorkingYears: 6,
      TrainingTimesLastYear: 2,
      WorkLifeBalance: 1,
      YearsAtCompany: 2,
      YearsInCurrentRole: 1,
      YearsSinceLastPromotion: 4,
      YearsWithCurrManager: 1
    }
  },
  case2_moderate_risk: {
    id: "Employee #210",
    label: "⚠️ Case 2: Moderate Risk (#210)",
    description: "Frequent travel, moderate income, stagnated promotion, medium satisfaction.",
    data: {
      Age: 38,
      BusinessTravel: "Travel_Frequently",
      DailyRate: 720,
      Department: "Research & Development",
      DistanceFromHome: 14,
      Education: 3,
      EducationField: "Medical",
      EnvironmentSatisfaction: 2,
      Gender: "Male",
      HourlyRate: 65,
      JobInvolvement: 3,
      JobLevel: 2,
      JobRole: "Manufacturing Director",
      JobSatisfaction: 2,
      MaritalStatus: "Married",
      MonthlyIncome: 4800,
      MonthlyRate: 14500,
      NumCompaniesWorked: 3,
      OverTime: "No",
      PercentSalaryHike: 14,
      PerformanceRating: 3,
      RelationshipSatisfaction: 3,
      StockOptionLevel: 1,
      TotalWorkingYears: 12,
      TrainingTimesLastYear: 3,
      WorkLifeBalance: 2,
      YearsAtCompany: 6,
      YearsInCurrentRole: 4,
      YearsSinceLastPromotion: 3,
      YearsWithCurrManager: 4
    }
  },
  case3_low_risk: {
    id: "Employee #108",
    label: "✅ Case 3: Low Risk (#108)",
    description: "No overtime, high salary, high stock level, excellent job & environment satisfaction.",
    data: {
      Age: 42,
      BusinessTravel: "Travel_Rarely",
      DailyRate: 1150,
      Department: "Research & Development",
      DistanceFromHome: 4,
      Education: 4,
      EducationField: "Technical Degree",
      EnvironmentSatisfaction: 4,
      Gender: "Male",
      HourlyRate: 82,
      JobInvolvement: 4,
      JobLevel: 3,
      JobRole: "Healthcare Representative",
      JobSatisfaction: 4,
      MaritalStatus: "Married",
      MonthlyIncome: 8900,
      MonthlyRate: 19200,
      NumCompaniesWorked: 1,
      OverTime: "No",
      PercentSalaryHike: 18,
      PerformanceRating: 4,
      RelationshipSatisfaction: 4,
      StockOptionLevel: 2,
      TotalWorkingYears: 16,
      TrainingTimesLastYear: 4,
      WorkLifeBalance: 3,
      YearsAtCompany: 10,
      YearsInCurrentRole: 7,
      YearsSinceLastPromotion: 1,
      YearsWithCurrManager: 7
    }
  }
};

export function generateClientPrediction(input: EmployeeInput): PredictionResponse {
  // Pure local simulation fallback matching XGBoost model rules if backend offline
  let riskScore = 0.15;
  if (input.OverTime === 'Yes') riskScore += 0.32;
  if (input.MonthlyIncome < 3500) riskScore += 0.22;
  if (input.JobSatisfaction <= 2) riskScore += 0.15;
  if (input.EnvironmentSatisfaction <= 2) riskScore += 0.12;
  if (input.DistanceFromHome > 15) riskScore += 0.08;
  if (input.StockOptionLevel === 0) riskScore += 0.07;
  if (input.YearsSinceLastPromotion >= 3) riskScore += 0.09;
  
  riskScore = Math.min(Math.max(riskScore, 0.05), 0.96);
  
  const threshold = 0.45;
  let risk_level = "Low Risk";
  let risk_color = "#10b981";
  let risk_badge = "STABLE RETENTION";
  
  if (riskScore >= threshold) {
    risk_level = "High Risk";
    risk_color = "#ef4444";
    risk_badge = "CRITICAL ALERT";
  } else if (riskScore >= 0.28) {
    risk_level = "Moderate Risk";
    risk_color = "#f59e0b";
    risk_badge = "MONITOR CLOSELY";
  }

  const shapWaterfall = [
    { feature_raw: "OverTime_Yes", feature_name: "OverTime Work", shap_value: input.OverTime === 'Yes' ? 0.341 : -0.120, scaled_value: 1 },
    { feature_raw: "MonthlyIncome", feature_name: "Monthly Income", shap_value: input.MonthlyIncome < 4000 ? 0.285 : -0.210, scaled_value: input.MonthlyIncome },
    { feature_raw: "JobSatisfaction", feature_name: "Job Satisfaction", shap_value: input.JobSatisfaction <= 2 ? 0.184 : -0.154, scaled_value: input.JobSatisfaction },
    { feature_raw: "StockOptionLevel", feature_name: "Stock Options", shap_value: input.StockOptionLevel === 0 ? 0.142 : -0.198, scaled_value: input.StockOptionLevel },
    { feature_raw: "EnvironmentSatisfaction", feature_name: "Environment Sat.", shap_value: input.EnvironmentSatisfaction <= 2 ? 0.125 : -0.115, scaled_value: input.EnvironmentSatisfaction },
    { feature_raw: "DistanceFromHome", feature_name: "Commute Distance", shap_value: input.DistanceFromHome > 15 ? 0.095 : -0.065, scaled_value: input.DistanceFromHome },
    { feature_raw: "YearsSinceLastPromotion", feature_name: "Promotion Delay", shap_value: input.YearsSinceLastPromotion >= 3 ? 0.088 : -0.075, scaled_value: input.YearsSinceLastPromotion },
    { feature_raw: "WorkLifeBalance", feature_name: "Work-Life Balance", shap_value: input.WorkLifeBalance <= 2 ? 0.076 : -0.092, scaled_value: input.WorkLifeBalance }
  ].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

  const limeRules = shapWaterfall.map(s => ({
    feature: s.feature_name,
    weight: Number((s.shap_value * 1.1).toFixed(4)),
    effect: s.shap_value > 0 ? "Increases Risk" : "Lowers Risk"
  }));

  const recommendations = [];
  if (input.OverTime === 'Yes') {
    recommendations.push({
      category: "Workload & Burnout",
      priority: "HIGH" as const,
      issue: "Employee works frequent OverTime, driving burnout and attrition.",
      action: "Cap weekly overtime, review task distribution, and offer compensatory flex-time."
    });
  }
  if (input.MonthlyIncome < 4000) {
    recommendations.push({
      category: "Compensation & Benefits",
      priority: "HIGH" as const,
      issue: `Monthly income ($${input.MonthlyIncome.toLocaleString()}) is below market benchmark.`,
      action: "Schedule an immediate compensation review and evaluate merit salary adjustments."
    });
  }
  if (input.JobSatisfaction <= 2 || input.EnvironmentSatisfaction <= 2) {
    recommendations.push({
      category: "Engagement & Culture",
      priority: "MEDIUM" as const,
      issue: `Low satisfaction scores (Job: ${input.JobSatisfaction}/4, Environment: ${input.EnvironmentSatisfaction}/4).`,
      action: "Conduct a 1-on-1 stay interview to address team culture and role alignment."
    });
  }
  if (input.YearsSinceLastPromotion >= 3) {
    recommendations.push({
      category: "Career Progression",
      priority: "MEDIUM" as const,
      issue: `Employee has not received a promotion in ${input.YearsSinceLastPromotion} years.`,
      action: "Define a 6-month career advancement roadmap with clear milestone criteria."
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      category: "Retention Maintenance",
      priority: "LOW" as const,
      issue: "No critical risk drivers identified.",
      action: "Maintain regular check-ins and recognize ongoing performance contributions."
    });
  }

  return {
    prediction: {
      attrition_probability: Number((riskScore * 100).toFixed(1)),
      probability_raw: riskScore,
      optimal_threshold: threshold,
      risk_level,
      risk_color,
      risk_badge
    },
    explainability: {
      base_value: 0.162,
      shap_waterfall: shapWaterfall,
      lime_local_rules: limeRules
    },
    managerial_report: {
      employee_summary: `Age ${input.Age}, ${input.Department} (${input.JobRole})`,
      top_attrition_drivers: shapWaterfall.filter(s => s.shap_value > 0).slice(0, 3).map(s => `${s.feature_name} (+${s.shap_value.toFixed(2)})`),
      top_retention_factors: shapWaterfall.filter(s => s.shap_value < 0).slice(0, 3).map(s => `${s.feature_name} (${s.shap_value.toFixed(2)})`),
      actionable_recommendations: recommendations
    }
  };
}
