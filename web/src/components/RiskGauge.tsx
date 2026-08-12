'use client';

import React from 'react';
import { PredictionResponse } from '../lib/types';

interface Props {
  prediction: PredictionResponse['prediction'];
  summary: string;
}

export default function RiskGauge({ prediction, summary }: Props) {
  const prob = prediction.attrition_probability;
  const isHighRisk = prob >= 45;

  return (
    <div className="p-6 rounded-xl border border-zinc-200 bg-white mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase mb-2 ${
              isHighRisk ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
            }`}
          >
            {prediction.risk_badge}
          </span>
          <h2 className="text-2xl font-bold text-zinc-900">{prediction.risk_level}</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{summary}</p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-4xl font-extrabold tracking-tight text-zinc-900 block">
            {prob}%
          </span>
          <span className="text-xs text-zinc-500 font-medium">Attrition Probability</span>
        </div>
      </div>

      {/* Meter Bar */}
      <div className="relative w-full h-2.5 bg-zinc-100 rounded-full overflow-visible mt-2 border border-zinc-200">
        <div
          className="h-full rounded-full transition-all duration-300 bg-zinc-900"
          style={{ width: `${Math.min(prob, 100)}%` }}
        />
        {/* Optimal Alert Marker */}
        <div
          className="absolute -top-5 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: '45%' }}
        >
          <span className="text-[10px] font-bold text-zinc-600 uppercase bg-white px-1 border border-zinc-300 rounded">
            Alert (45%)
          </span>
          <div className="w-px h-2 bg-zinc-400 mt-0.5" />
        </div>
      </div>
    </div>
  );
}
