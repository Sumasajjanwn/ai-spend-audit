'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type ToolRecommendation = {
  tool: string;
  currentMonthly: number;
  recommendedMonthly: number;
  action: 'downgrade' | 'switch' | 'keep';
  reason: string;
  savingsMonthly: number;
};

type AuditResult = {
  perTool: ToolRecommendation[];
  totalSavingsMonthly: number;
  totalSavingsAnnual: number;
};

type AuditPayload = {
  input: {
    teamSize: number;
    primaryUseCase: string;
  };
  result: AuditResult;
};

function ShareContent() {
  const searchParams = useSearchParams();

  const payload = useMemo(() => {
    const raw = searchParams.get('data');
    if (!raw) return null;

    try {
      return JSON.parse(decodeURIComponent(raw)) as AuditPayload;
    } catch {
      return null;
    }
  }, [searchParams]);

  if (!payload) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-semibold">Invalid share link</h1>
          <p className="mt-2 text-sm text-slate-400">
            This link is missing audit data or is not formatted correctly.
          </p>
          <a
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300"
          >
            Go to homepage
          </a>
        </div>
      </main>
    );
  }

  const { input, result } = payload;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
          <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-300">
            Shared audit
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shared AI spend audit report
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            This report was shared using encoded audit data in the URL.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Estimated savings</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                  <p className="text-sm text-emerald-300">Per month</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    ₹{result.totalSavingsMonthly.toFixed(0)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Per year</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    ₹{result.totalSavingsAnnual.toFixed(0)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Per-tool recommendations</h2>
              <div className="mt-4 space-y-4">
                {result.perTool.map((item) => (
                  <div
                    key={item.tool}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{item.tool}</h3>
                        <p className="mt-1 text-sm text-slate-400">{item.reason}</p>
                      </div>
                      <span className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                        {item.action}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Current</p>
                        <p className="mt-1 text-lg font-semibold">₹{item.currentMonthly.toFixed(0)}</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Recommended</p>
                        <p className="mt-1 text-lg font-semibold">₹{item.recommendedMonthly.toFixed(0)}</p>
                      </div>
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                        <p className="text-xs uppercase tracking-wide text-emerald-300">Savings</p>
                        <p className="mt-1 text-lg font-semibold">₹{item.savingsMonthly.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Audit context</h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Team size</p>
                  <p className="mt-1 text-lg font-semibold text-white">{input.teamSize}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Primary use case</p>
                  <p className="mt-1 text-lg font-semibold capitalize text-white">
                    {input.primaryUseCase}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Open the app</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Run your own audit and generate a fresh share link from the app homepage.
              </p>
              <a
                href="/"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Go to homepage
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center">
            <h1 className="text-2xl font-semibold">Loading shared audit...</h1>
            <p className="mt-2 text-sm text-slate-400">
              Please wait while the shared report is being prepared.
            </p>
          </div>
        </main>
      }
    >
      <ShareContent />
    </Suspense>
  );
}