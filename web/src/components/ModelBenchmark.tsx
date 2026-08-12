'use client';

import React from 'react';

export default function ModelBenchmark() {
  const models = [
    { name: 'Decision Tree', acc: '0.7857', prec: '0.3261', rec: '0.3191', f1: '0.3226', auc: '0.5968', winner: false },
    { name: 'Random Forest', acc: '0.8401', prec: '0.5000', rec: '0.2128', f1: '0.2985', auc: '0.7805', winner: false },
    { name: 'XGBoost Classifier', acc: '0.8776', prec: '0.7200', rec: '0.3830', f1: '0.5000', auc: '0.8041', winner: true }
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">
            Model Benchmark Comparison
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Empirical evaluation on IBM HR Attrition dataset (1,470 samples, 80-20 Stratified Split with SMOTE).
          </p>
        </div>
        <span className="px-3 py-1 rounded text-xs font-bold bg-zinc-900 text-white">
          Selected Model: XGBoost
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500 font-semibold">
              <th className="py-2.5 px-4">Model Candidate</th>
              <th className="py-2.5 px-4">Accuracy</th>
              <th className="py-2.5 px-4">Precision</th>
              <th className="py-2.5 px-4">Recall</th>
              <th className="py-2.5 px-4">F1-Score</th>
              <th className="py-2.5 px-4">ROC-AUC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {models.map((m, i) => (
              <tr
                key={i}
                className={
                  m.winner
                    ? 'bg-zinc-50 font-bold text-zinc-900 border-l-4 border-l-zinc-900'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }
              >
                <td className="py-2.5 px-4">{m.name}</td>
                <td className="py-2.5 px-4 font-mono">{m.acc}</td>
                <td className="py-2.5 px-4 font-mono">{m.prec}</td>
                <td className="py-2.5 px-4 font-mono">{m.rec}</td>
                <td className="py-2.5 px-4 font-mono">{m.f1}</td>
                <td className="py-2.5 px-4 font-mono font-extrabold text-zinc-900">{m.auc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
