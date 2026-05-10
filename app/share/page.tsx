'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type ToolRecommendation = {
  tool: string;
  currentMonthly: number;
  recommendedMonthly: number;
  action: 'downgrade' | 'switch' | 'keep';
  reason: string;
  savingsMonthly: number;
};

type SharePayload = {
  input: {
    teamSize: number;
    primaryUseCase: string;
  };
  result: {
    perTool: ToolRecommendation[];
    totalSavingsMonthly: number;
    totalSavingsAnnual: number;
  };
};

export default function SharePage() {
  const searchParams = useSearchParams();

  const payload = useMemo(() => {
    const raw = searchParams.get('data');
    if (!raw) return null;

    try {
      return JSON.parse(decodeURIComponent(raw)) as SharePayload;
    } catch {
      return null;
    }
  }, [searchParams]);

  if (!payload) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300">Invalid or missing shared audit data.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Shared AI spend audit</h1>

        <section className="mb-6 rounded border border-emerald-500/50 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-300 mb-1">Estimated savings</p>
          <p className="text-2xl font-semibold">
            ~₹{payload.result.totalSavingsMonthly.toFixed(0)}/month
          </p>
          <p className="text-slate-300">
            ≈ ₹{payload.result.totalSavingsAnnual.toFixed(0)} per year
          </p>
        </section>

        <section className="mb-6 rounded border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold mb-2">Team context</h2>
          <p className="text-sm text-slate-300">
            Team size: {payload.input.teamSize}
          </p>
          <p className="text-sm text-slate-300">
            Primary use case: {payload.input.primaryUseCase}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
          {payload.result.perTool.map((r) => (
            <div
              key={r.tool}
              className="mb-3 rounded border border-slate-800 bg-slate-900 p-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium capitalize">{r.tool}</span>
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  {r.action}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                Current spend: ₹{r.currentMonthly.toFixed(0)} / month
              </p>
              <p className="text-sm text-slate-300">
                Recommended spend: ₹{r.recommendedMonthly.toFixed(0)} / month
              </p>
              <p className="text-sm text-emerald-300">
                Estimated savings: ₹{r.savingsMonthly.toFixed(0)} / month
              </p>
              <p className="mt-1 text-sm text-slate-400">{r.reason}</p>
            </div>
          ))}
        </section>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to homepage
        </a>
      </div>
    </main>
  );
}