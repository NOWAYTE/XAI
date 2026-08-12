'use client';

import React from 'react';

export default function AcademicTheory() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-base font-bold text-zinc-900">Academic & Theoretical Grounding</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Connecting Machine Learning performance with managerial behavioral theories for dissertation defense.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* TAM */}
        <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-lg">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
            Technology Acceptance Model (TAM)
          </h3>
          <p className="text-xs text-zinc-700 leading-relaxed">
            Explains how managers adopt technology. By converting complex XGBoost decision matrices into visual SHAP attributions and clear HR action steps, this XAI framework drastically increases <strong>Perceived Usefulness (PU)</strong> and <strong>Perceived Ease of Use (PEOU)</strong>, overcoming the traditional rejection of &quot;black box&quot; risk scores.
          </p>
        </div>

        {/* Human-AI Trust */}
        <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-lg">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
            Human-AI Trust Theory
          </h3>
          <p className="text-xs text-zinc-700 leading-relaxed">
            Transparency creates <strong>Cognitive Trust</strong>. Managers can inspect individual feature attributions (e.g. Overtime vs Low Salary), preventing both <em>Over-reliance</em> (blind automated compliance) and <em>Under-reliance</em> (relying purely on gut feeling).
          </p>
        </div>
      </div>
    </div>
  );
}
