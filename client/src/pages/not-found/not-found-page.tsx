import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 text-slate-300">
          The route you opened does not exist yet. Head back to the FlowPay builder workspace.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Go to builder
        </Link>
      </div>
    </main>
  )
}
