def generate_managerial_recommendations(raw_data: dict, shap_impacts: list) -> list:
    """
    Generates actionable, plain-English managerial recommendations based on top SHAP feature impacts
    and actual employee attribute values.
    """
    recommendations = []
    
    # Sort features by highest positive impact on Attrition risk
    risk_drivers = sorted(shap_impacts, key=lambda x: x['shap_value'], reverse=True)
    
    top_risk_feature_names = [f['feature_name'] for f in risk_drivers[:5] if f['shap_value'] > 0]
    
    # Rule 1: Overtime
    if raw_data.get('OverTime') == 'Yes' or any('OverTime' in f for f in top_risk_feature_names):
        recommendations.append({
            "category": "Workload & Burnout",
            "priority": "HIGH",
            "issue": "Employee is working frequent OverTime, which is a key driver of attrition.",
            "action": "Cap weekly overtime hours, review project workload allocation, and offer compensatory flex-time."
        })
        
    # Rule 2: Monthly Income / Compensation
    monthly_income = raw_data.get('MonthlyIncome', 5000)
    if monthly_income < 4000 or any('MonthlyIncome' in f for f in top_risk_feature_names):
        recommendations.append({
            "category": "Compensation & Benefits",
            "priority": "HIGH" if monthly_income < 3500 else "MEDIUM",
            "issue": f"Monthly income (${monthly_income:,}) is below departmental benchmarks, impacting retention.",
            "action": "Schedule an immediate salary benchmarking review and evaluate merit-based pay adjustments."
        })
        
    # Rule 3: Job Satisfaction / Work Environment
    job_sat = raw_data.get('JobSatisfaction', 3)
    env_sat = raw_data.get('EnvironmentSatisfaction', 3)
    if job_sat <= 2 or env_sat <= 2 or any('JobSatisfaction' in f or 'EnvironmentSatisfaction' in f for f in top_risk_feature_names):
        recommendations.append({
            "category": "Engagement & Satisfaction",
            "priority": "HIGH" if job_sat == 1 else "MEDIUM",
            "issue": f"Low satisfaction rating (Job: {job_sat}/4, Environment: {env_sat}/4).",
            "action": "Conduct a 1-on-1 stay interview to address workplace friction, role clarity, and culture concerns."
        })
        
    # Rule 4: Work-Life Balance
    wlb = raw_data.get('WorkLifeBalance', 3)
    if wlb <= 2 or any('WorkLifeBalance' in f for f in top_risk_feature_names):
        recommendations.append({
            "category": "Flexibility & Well-being",
            "priority": "MEDIUM",
            "issue": f"Work-Life Balance rating is low ({wlb}/4).",
            "action": "Offer hybrid/remote work flexibility options and conduct a well-being check-in."
        })
        
    # Rule 5: Career Growth & Promotion Stagnation
    years_since_promo = raw_data.get('YearsSinceLastPromotion', 0)
    years_at_company = raw_data.get('YearsAtCompany', 0)
    if years_since_promo >= 4 or (years_at_company > 3 and years_since_promo >= 3) or any('YearsSinceLastPromotion' in f for f in top_risk_feature_names):
        recommendations.append({
            "category": "Career Progression",
            "priority": "MEDIUM",
            "issue": f"Employee has not received a promotion in {years_since_promo} years.",
            "action": "Establish a clear 6-month professional growth roadmap with defined promotion criteria."
        })

    # Rule 6: Stock Option Level
    stock_level = raw_data.get('StockOptionLevel', 0)
    if stock_level == 0 and any('StockOptionLevel' in f for f in top_risk_feature_names):
        recommendations.append({
            "category": "Financial Incentives",
            "priority": "LOW",
            "issue": "Employee holds zero stock options, decreasing long-term company alignment.",
            "action": "Consider adding employee to the equity incentive or performance bonus program."
        })

    # Default recommendation if risk is low or specific rules didn't trigger
    if not recommendations:
        recommendations.append({
            "category": "Retention Maintenance",
            "priority": "LOW",
            "issue": "No critical risk drivers identified.",
            "action": "Maintain regular 1-on-1 check-ins and continue recognizing employee contributions."
        })
        
    return recommendations
