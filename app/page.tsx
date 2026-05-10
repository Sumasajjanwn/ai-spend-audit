'use client';

import { useEffect, useState } from 'react';

type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

type ToolKey =
  | 'cursor'
  | 'copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'windsurf';

type ToolInput = {
  tool: ToolKey;
  plan: string;
  monthlySpend: number;
  seats: number;
};

type AuditInput = {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: UseCase;
};

const STORAGE_KEY = 'ai-spend-audit-input';

const TOOL_OPTIONS: ToolKey[] = [
  'cursor',
  'copilot',
  'claude',
  'chatgpt',
  'anthropic',
  'openai',
  'gemini',
  'windsurf',
];

export default function HomePage() {
  const [form, setForm] = useState<AuditInput>({
    tools: [
      {
        tool: 'cursor',
        plan: '',
        monthlySpend: 0,
        seats: 1,
      },
    ],
    teamSize: 5,
    primaryUseCase: 'coding',
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as AuditInput;
      setForm(parsed);
    } catch {
      // ignore bad local data
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const updateTool = <K extends keyof ToolInput>(
    index: number,
    field: K,
    value: ToolInput[K]
  ) => {
    setForm((prev) => {
      const updatedTools = [...prev.tools];
      updatedTools[index] = {
        ...updatedTools[index],
        [field]: value,
      };
      return {
        ...prev,
        tools: updatedTools,
      };
    });
  };

  const addTool = () => {
    setForm((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          tool: 'copilot',
          plan: '',
          monthlySpend: 0,
          seats: 1,
        },
      ],
    }));
  };

  const removeTool = (index: number) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const handleRunAudit = () => {
    window.location.href = '/audit';
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              AI Spend Optimizer
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Audit your AI tool spend in minutes
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Enter your current AI tools, plans, and monthly spend to get savings recommendations,
              a simple summary, and a shareable report.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Step 1</p>
                <p className="mt-1 text-sm font-medium text-white">Add tool details</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Step 2</p>
                <p className="mt-1 text-sm font-medium text-white">Run spend audit</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Step 3</p>
                <p className="mt-1 text-sm font-medium text-white">Share or save report</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Audit inputs</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Add your team details and current tool costs.
                </p>
              </div>

              <button
                type="button"
                onClick={addTool}
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                + Add another tool
              </button>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Team size
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  value={form.teamSize}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      teamSize: Number(e.target.value) || 1,
                    }))
                  }
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Primary use case
                </label>
                <select
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  value={form.primaryUseCase}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      primaryUseCase: e.target.value as UseCase,
                    }))
                  }
                >
                  <option value="coding">Coding</option>
                  <option value="writing">Writing</option>
                  <option value="data">Data</option>
                  <option value="research">Research</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {form.tools.map((tool, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Tool {index + 1}
                    </h3>
                    {form.tools.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTool(index)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Tool name
                      </label>
                      <select
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        value={tool.tool}
                        onChange={(e) =>
                          updateTool(index, 'tool', e.target.value as ToolKey)
                        }
                      >
                        {TOOL_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Plan name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        placeholder="Pro / Business / Enterprise"
                        value={tool.plan}
                        onChange={(e) => updateTool(index, 'plan', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Monthly spend (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        value={tool.monthlySpend}
                        onChange={(e) =>
                          updateTool(index, 'monthlySpend', Number(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-200">
                        Seats
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        value={tool.seats}
                        onChange={(e) =>
                          updateTool(index, 'seats', Number(e.target.value) || 1)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRunAudit}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 sm:w-auto"
            >
              Run audit
            </button>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">What you get</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm font-medium text-white">Savings estimate</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Quick monthly and yearly cost reduction suggestions.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm font-medium text-white">Tool recommendations</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Keep, downgrade, or switch suggestions for each tool.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm font-medium text-white">Shareable output</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Save leads, copy a share link, and show the audit to others.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                Tip
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Start with your most expensive tool
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Even one accurate tool entry is enough to test the flow. You can add more
                tools later and rerun the audit anytime.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}