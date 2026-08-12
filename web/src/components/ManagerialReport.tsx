'use client';

import React from 'react';
import { Recommendation } from '../lib/types';

interface Props {
  drivers: string[];
  retention: string[];
  recommendations: Recommendation[];
}

export default function ManagerialReport({ drivers, retention, recommendations }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 printable-area">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
        <div>
          <h3 className="text-base font-bold text-zinc-900">
            Managerial Decision Report & Action Plan
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Actionable HR recommendations generated from SHAP & LIME XAI feature attribution.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print px-3.5 py-1.5 rounded-md text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all"
        >
          Print / Export PDF Report
        </button>
      </div>

      {/* Top Drivers & Retention Catalysts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
            Top Risk Drivers (Why They Might Leave)
          </h4>
          <ul className="space-y-1">
            {drivers.map((d, i) => (
              <li key={i} className="text-xs font-medium text-zinc-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
            Retention Catalysts (Why They Might Stay)
          </h4>
          <ul className="space-y-1">
            {retention.map((r, i) => (
              <li key={i} className="text-xs font-medium text-zinc-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations List */}
      <div>
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
          Recommended SME Manager Actions
        </h4>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const isHigh = rec.priority === 'HIGH';

            return (
              <div
                key={idx}
                className="p-4 bg-white border border-zinc-200 border-l-4 border-l-zinc-900 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-900">{rec.category}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isHigh ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    }`}
                  >
                    {rec.priority} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mb-2">
                  <strong className="text-zinc-900">Diagnosed Problem:</strong> {rec.issue}
                </p>
                <p className="text-xs font-medium text-zinc-900 bg-zinc-50 p-2.5 rounded border border-zinc-200">
                  <strong>Action Plan:</strong> {rec.action}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
