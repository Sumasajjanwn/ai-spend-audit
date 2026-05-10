'use client';

import { useEffect, useMemo, useState } from 'react';

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

const STORAGE_KEY = 'ai-spend-audit-input';

function runAudit(input: AuditInput): AuditResult {
  const perTool: ToolRecommendation[] = [];

  for (const t of input.tools) {
    if (!t.plan || t.monthlySpend <= 0) continue;

    const current = t.monthlySpend;
    let recommended = current;
    let action: ToolRecommendation['action'] = 'keep';
    let reason = 'Your current plan looks reasonable for your team size.';
    let savings = 0;

    if (t.seats <= 3 && /business|enterprise/i.test(t.plan)) {
      recommended = current * 0.6;
      action = 'downgrade';
      reason =
        'Small team on a higher tier plan. Downgrading to an individual/team plan should cover your needs.';
    } else if (input.primaryUseCase === 'coding' && /max|pro|enterprise/i.test(t.plan)) {
      recommended = current * 0.7;
      action = 'switch';
      reason =
        'For mainly coding work, cheaper tools like GitHub Copilot may cover most use cases.';
    }

    savings = Math.max(0, current - recommended);

    perTool.push({
      tool: t.tool,
      currentMonthly: current,
      recommendedMonthly: recommended,
      action,
      reason,
      savingsMonthly: savings,
    });
  }

  const totalSavingsMonthly = perTool.reduce((sum, r) => sum + r.savingsMonthly, 0);
  const totalSavingsAnnual = totalSavingsMonthly * 12;

  return { perTool, totalSavingsMonthly, totalSavingsAnnual };
}

export default function AuditPage() {
  const [input, setInput] = useState<AuditInput | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed: AuditInput = JSON.parse(saved);
      setInput(parsed);
      setResult(runAudit(parsed));
    } catch {
      // ignore
    }
  }, []);

  const shareUrl = useMemo(() => {
    if (!input || !result || typeof window === 'undefined') return '';

    const payload = {
      input,
      result,
    };

    const encoded = encodeURIComponent(JSON.stringify(payload));
    return `${window.location.origin}/share?data=${encoded}`;
  }, [input, result]);

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Share link copied.');
    } catch {
      setShareMessage('Could not copy link.');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubmitMessage('Please enter your email.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage('');

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize: input?.teamSize ?? 0,
          primaryUseCase: input?.primaryUseCase ?? '',
          monthlySavings: result?.totalSavingsMonthly ?? 0,
          annualSavings: result?.totalSavingsAnnual ?? 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitMessage(data.error || 'Something went wrong.');
        return;
      }

      setSubmitMessage('Email captured successfully.');
      setEmail('');
      setCompanyName('');
      setRole('');
    } catch {
      setSubmitMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!input || !result) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-semibold">No audit data found</h1>
          <p className="mt-2 text-sm text-slate-400">
            Go back to the form, enter your tool details, and run the audit again.
          </p>
          <a
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Back to homepage
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
                Audit results
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your AI spend audit
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Review projected savings, tool recommendations, and a summary you can share with
                your team.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-300">Monthly savings</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  ₹{result.totalSavingsMonthly.toFixed(0)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Annual savings</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  ₹{result.totalSavingsAnnual.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.95fr]">
          <section className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Estimated savings</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                  <p className="text-sm text-emerald-300">Per month</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    ~₹{result.totalSavingsMonthly.toFixed(0)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Per year</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    ₹{result.totalSavingsAnnual.toFixed(0)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                These estimates are based on the plans and team details you entered. They are meant
                to help you spot obvious overspend and prioritise quick wins.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Per-tool recommendations</h2>
                <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                  {result.perTool.length} tools reviewed
                </span>
              </div>

              {result.perTool.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-sm text-slate-300">
                    We didn&apos;t detect any obvious overspend based on the data you entered.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {result.perTool.map((r) => (
                  <div
                    key={r.tool}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold capitalize text-white">{r.tool}</h3>
                        <p className="mt-1 text-sm text-slate-400">{r.reason}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                          r.action === 'downgrade'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : r.action === 'switch'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {r.action}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Current</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          ₹{r.currentMonthly.toFixed(0)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Recommended</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          ₹{r.recommendedMonthly.toFixed(0)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                        <p className="text-xs uppercase tracking-wide text-emerald-300">Savings</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          ₹{r.savingsMonthly.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">AI summary</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                For a team of {input.teamSize} people mainly doing {input.primaryUseCase} work, your
                largest AI spend is on{' '}
                {result.perTool.length > 0 ? result.perTool[0].tool : 'your current tools'}. By
                downgrading or switching a few plans, you could save roughly ₹
                {result.totalSavingsMonthly.toFixed(0)} per month, or about ₹
                {result.totalSavingsAnnual.toFixed(0)} per year. Start by applying the biggest
                single recommendation above, then review the remaining tools quarterly to keep spend
                aligned with your actual usage.
              </p>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Share this audit</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Copy a shareable link with the current audit data embedded in the URL.
              </p>

              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300 break-all">
                {shareUrl}
              </div>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Copy share link
              </button>

              {shareMessage && <p className="mt-3 text-sm text-slate-300">{shareMessage}</p>}
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Get this report by email</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Save this audit in your pipeline and follow up with optimization ideas later.
              </p>

              <form onSubmit={handleLeadSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Company name (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Labs"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Role (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Founder / Engineering Manager"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Email me this report'}
                </button>

                {submitMessage && (
                  <p className="text-sm text-slate-300">{submitMessage}</p>
                )}
              </form>
            </section>

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

              <a
                href="/"
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Back to form
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}