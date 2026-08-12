'use client';

import React from 'react';
import { LimeRule } from '../lib/types';

interface Props {
  rules: LimeRule[];
}

export default function LimeTable({ rules }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-bold text-zinc-900">
          LIME Local Decision Rules (Operational View)
        </h3>
        <span className="text-[11px] text-zinc-400 font-mono">Local Tabular</span>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Local linear decision boundary weights for this employee&apos;s profile.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500 font-semibold">
              <th className="py-2 px-3">Feature Name</th>
              <th className="py-2 px-3">Local Weight</th>
              <th className="py-2 px-3">Impact Effect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rules.map((rule, idx) => (
              <tr key={idx} className="hover:bg-zinc-50">
                <td className="py-2.5 px-3 font-semibold text-zinc-900">{rule.feature}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-zinc-800">
                  {rule.weight > 0 ? `+${rule.weight.toFixed(4)}` : rule.weight.toFixed(4)}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      rule.effect === 'Increases Risk'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                    }`}
                  >
                    {rule.effect}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
