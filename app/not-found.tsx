import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto mb-4 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
            404 error
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            The page you are looking for does not exist, was moved, or the link is incorrect.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Go to homepage
            </Link>

            <Link
              href="/audit"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Go to audit page
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Available routes
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>/</li>
              <li>/audit</li>
              <li>/share</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}