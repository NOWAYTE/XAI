'use client';

import React from 'react';
import { ShapImpact } from '../lib/types';

interface Props {
  data: ShapImpact[];
}

export default function ShapWaterfall({ data }: Props) {
  const top8 = data.slice(0, 8);
  const maxAbs = Math.max(...top8.map(d => Math.abs(d.shap_value)), 0.1);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-bold text-zinc-900">
          SHAP Waterfall Attribution (Strategic View)
        </h3>
        <span className="text-[11px] text-zinc-400 font-mono">TreeExplainer</span>
      </div>
      <p className="text-xs text-zinc-500 mb-6">
        Attribution values pushing employee risk higher (+ Risk) or lower (- Retention).
      </p>

      <div className="space-y-3">
        {top8.map((item, idx) => {
          const val = item.shap_value;
          const isRisk = val > 0;
          const pct = Math.min((Math.abs(val) / maxAbs) * 100, 100);

          return (
            <div key={idx} className="flex items-center text-xs">
              <div className="w-36 truncate font-medium text-zinc-800 pr-2">
                {item.feature_name}
              </div>

              {/* Bar Container */}
              <div className="flex-1 h-5 bg-zinc-100 rounded overflow-hidden relative flex items-center border border-zinc-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    isRisk ? 'bg-zinc-900' : 'bg-zinc-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <span className="absolute right-2 font-mono font-bold text-xs text-zinc-700">
                  {val > 0 ? `+${val.toFixed(3)}` : val.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
