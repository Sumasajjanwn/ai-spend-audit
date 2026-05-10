'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-red-300">
            Unexpected error
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Something went wrong
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            The page crashed while rendering. Try again, or go back to the homepage and restart the flow.
          </p>

          {error?.message && (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Error message
              </p>
              <p className="mt-2 break-words text-sm text-slate-300">
                {error.message}
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Try again
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}