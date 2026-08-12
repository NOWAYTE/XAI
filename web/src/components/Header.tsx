'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-200 mb-8 gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          XAI Workforce Decision Support System
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Explainable AI Framework for SME Employee Retention (XGBoost + SHAP + LIME)
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
          XGBoost (ROC-AUC: 0.804)
        </span>
        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-zinc-900 text-white">
          Threshold: 0.45
        </span>
      </div>
    </header>
  );
}
