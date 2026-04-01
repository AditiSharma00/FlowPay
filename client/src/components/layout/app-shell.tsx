import type { PropsWithChildren, ReactNode } from 'react'

type AppShellProps = PropsWithChildren<{
  toolbar?: ReactNode
}>

export function AppShell({ children, toolbar }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">FlowPay</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              MVP Builder Workspace
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Phase 1
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  )
}
