export interface EmployeeInput {
  Age: number;
  BusinessTravel: string;
  DailyRate: number;
  Department: string;
  DistanceFromHome: number;
  Education: number;
  EducationField: string;
  EnvironmentSatisfaction: number;
  Gender: string;
  HourlyRate: number;
  JobInvolvement: number;
  JobLevel: number;
  JobRole: string;
  JobSatisfaction: number;
  MaritalStatus: string;
  MonthlyIncome: number;
  MonthlyRate: number;
  NumCompaniesWorked: number;
  OverTime: string;
  PercentSalaryHike: number;
  PerformanceRating: number;
  RelationshipSatisfaction: number;
  StockOptionLevel: number;
  TotalWorkingYears: number;
  TrainingTimesLastYear: number;
  WorkLifeBalance: number;
  YearsAtCompany: number;
  YearsInCurrentRole: number;
  YearsSinceLastPromotion: number;
  YearsWithCurrManager: number;
}

export interface ShapImpact {
  feature_raw: string;
  feature_name: string;
  shap_value: number;
  scaled_value: number;
}

export interface LimeRule {
  feature: string;
  weight: number;
  effect: string;
}

export interface Recommendation {
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  action: string;
}

export interface PredictionResponse {
  prediction: {
    attrition_probability: number;
    probability_raw: number;
    optimal_threshold: number;
    risk_level: string;
    risk_color: string;
    risk_badge: string;
  };
  explainability: {
    base_value: number;
    shap_waterfall: ShapImpact[];
    lime_local_rules: LimeRule[];
  };
  managerial_report: {
    employee_summary: string;
    top_attrition_drivers: string[];
    top_retention_factors: string[];
    actionable_recommendations: Recommendation[];
  };
}

export interface PresetCase {
  id: string;
  label: string;
  description: string;
  data: EmployeeInput;
}
