'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import RiskGauge from '@/components/RiskGauge';
import ShapWaterfall from '@/components/ShapWaterfall';
import LimeTable from '@/components/LimeTable';
import ManagerialReport from '@/components/ManagerialReport';
import AcademicTheory from '@/components/AcademicTheory';
import ModelBenchmark from '@/components/ModelBenchmark';

import { PRESETS, generateClientPrediction } from '@/lib/data';
import { EmployeeInput, PredictionResponse } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'operational' | 'strategic'>('operational');
  const [activePreset, setActivePreset] = useState<string>('case1_high_risk');
  const [formData, setFormData] = useState<EmployeeInput>(PRESETS.case1_high_risk.data);
  const [prediction, setPrediction] = useState<PredictionResponse>(
    generateClientPrediction(PRESETS.case1_high_risk.data)
  );
  const [xaiMode, setXaiMode] = useState<'shap' | 'lime'>('shap');
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof EmployeeInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadPreset = (key: string) => {
    setActivePreset(key);
    const presetData = PRESETS[key].data;
    setFormData(presetData);
    evaluateEmployee(presetData);
  };

  const evaluateEmployee = async (dataToEvaluate: EmployeeInput = formData) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToEvaluate)
      });

      if (res.ok) {
        const json = await res.json();
        setPrediction(json);
      } else {
        setPrediction(generateClientPrediction(dataToEvaluate));
      }
    } catch (e) {
      setPrediction(generateClientPrediction(dataToEvaluate));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 p-4 md:p-8 max-w-[1400px] mx-auto font-sans">
      <Header />

      {/* Main Tab Navigation */}
      <div className="flex gap-2 mb-8 no-print border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab('operational')}
          className={`px-4 py-2 rounded-md font-bold text-xs transition-all ${
            activeTab === 'operational'
              ? 'bg-zinc-900 text-white'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          Operational View (Individual Case Audit)
        </button>

        <button
          onClick={() => setActiveTab('strategic')}
          className={`px-4 py-2 rounded-md font-bold text-xs transition-all ${
            activeTab === 'strategic'
              ? 'bg-zinc-900 text-white'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          Strategic View (Global XAI & Academic Theory)
        </button>
      </div>

      {activeTab === 'operational' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column */}
          <div className="lg:col-span-5 space-y-6 no-print">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="text-sm font-bold text-zinc-900 mb-1">
                Employee Profile Evaluator
              </h2>
              <p className="text-xs text-zinc-500 mb-4">
                Select a preset case study or adjust attributes manually.
              </p>

              {/* Presets */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Preset Case Studies:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => loadPreset(key)}
                      className={`text-left p-3 rounded-lg border text-xs font-semibold transition-all ${
                        activePreset === key
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className={`text-[11px] font-normal mt-0.5 ${activePreset === key ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-zinc-200 my-4" />

              {/* Form Controls */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  evaluateEmployee();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Age</label>
                    <input
                      type="number"
                      value={formData.Age}
                      onChange={e => handleInputChange('Age', Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Department</label>
                    <select
                      value={formData.Department}
                      onChange={e => handleInputChange('Department', e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Research & Development">Research & Development</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">OverTime Status</label>
                    <select
                      value={formData.OverTime}
                      onChange={e => handleInputChange('OverTime', e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-900"
                    >
                      <option value="Yes">Yes (Frequent OverTime)</option>
                      <option value="No">No Overtime</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Monthly Income ($)</label>
                    <input
                      type="number"
                      value={formData.MonthlyIncome}
                      onChange={e => handleInputChange('MonthlyIncome', Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Job Satisfaction (1-4)</label>
                    <select
                      value={formData.JobSatisfaction}
                      onChange={e => handleInputChange('JobSatisfaction', Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    >
                      <option value={1}>1 - Low</option>
                      <option value={2}>2 - Medium</option>
                      <option value={3}>3 - High</option>
                      <option value={4}>4 - Very High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Environment Sat. (1-4)</label>
                    <select
                      value={formData.EnvironmentSatisfaction}
                      onChange={e => handleInputChange('EnvironmentSatisfaction', Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    >
                      <option value={1}>1 - Low</option>
                      <option value={2}>2 - Medium</option>
                      <option value={3}>3 - High</option>
                      <option value={4}>4 - Very High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Work-Life Balance (1-4)</label>
                    <select
                      value={formData.WorkLifeBalance}
                      onChange={e => handleInputChange('WorkLifeBalance', Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    >
                      <option value={1}>1 - Bad</option>
                      <option value={2}>2 - Good</option>
                      <option value={3}>3 - Better</option>
                      <option value={4}>4 - Best</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-600 block mb-1 font-medium">Stock Option Level</label>
                    <select
                      value={formData.StockOptionLevel}
                      onChange={e => handleInputChange('StockOptionLevel', Number(e.target.value))}
                      className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none focus:border-zinc-900"
                    >
                      <option value={0}>0 - None</option>
                      <option value={1}>1 - Tier 1</option>
                      <option value={2}>2 - Tier 2</option>
                      <option value={3}>3 - Tier 3</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all"
                >
                  {loading ? 'Analyzing Explanations...' : 'Evaluate Risk & Generate Report'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Output Column */}
          <div className="lg:col-span-7">
            <RiskGauge
              prediction={prediction.prediction}
              summary={prediction.managerial_report.employee_summary}
            />

            {/* XAI Toggle Bar */}
            <div className="flex gap-2 mb-4 no-print">
              <button
                onClick={() => setXaiMode('shap')}
                className={`px-3.5 py-1.5 rounded font-bold text-xs transition-all ${
                  xaiMode === 'shap'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                SHAP Attribution
              </button>
              <button
                onClick={() => setXaiMode('lime')}
                className={`px-3.5 py-1.5 rounded font-bold text-xs transition-all ${
                  xaiMode === 'lime'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                LIME Decision Rules
              </button>
            </div>

            {xaiMode === 'shap' ? (
              <ShapWaterfall data={prediction.explainability.shap_waterfall} />
            ) : (
              <LimeTable rules={prediction.explainability.lime_local_rules} />
            )}

            <ManagerialReport
              drivers={prediction.managerial_report.top_attrition_drivers}
              retention={prediction.managerial_report.top_retention_factors}
              recommendations={prediction.managerial_report.actionable_recommendations}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <AcademicTheory />
          <ModelBenchmark />
        </div>
      )}
    </div>
  );
}
