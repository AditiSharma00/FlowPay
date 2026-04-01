import type { PropsWithChildren, ReactNode } from 'react'

type AppShellProps = PropsWithChildren<{
  toolbar?: ReactNode
}>

export function AppShell({ children, toolbar }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(251,146,60,0.14),transparent_24%),linear-gradient(180deg,rgba(255,249,242,0.92),rgba(255,244,234,0.72),rgba(255,253,249,0.92))]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.55),transparent_92%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-orange-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-1/4 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />

      <div className="relative z-10">
        <header className="border-b border-amber-100/80 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-start gap-3 rounded-full border border-amber-100 bg-white/70 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(180,83,9,0.35)] backdrop-blur">
              <div className="mt-0.5 h-3 w-3 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm shadow-amber-300/60" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">FlowPay</p>
                <h1 className="font-brand mt-1 text-[1.35rem] leading-none font-semibold tracking-tight text-slate-950">
                  AI Form Builder
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
              <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm shadow-amber-100/70">
                Phase 1
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
      </div>

      <div className="pointer-events-none absolute right-8 top-24 hidden xl:block">
        <div className="relative h-60 w-80">
          <div className="absolute left-8 top-7 h-full w-full rounded-[2rem] border border-white/60 bg-white/25 rotate-6 backdrop-blur-xl shadow-[0_30px_60px_-40px_rgba(180,83,9,0.35)]" />
          <div className="absolute left-0 top-0 h-full w-full rounded-[2rem] border border-white/70 bg-white/60 shadow-[0_28px_60px_-34px_rgba(180,83,9,0.45)] backdrop-blur-xl">
            <div className="space-y-4 p-5">
              <div className="h-3 w-24 rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500" />
              <div className="h-10 rounded-2xl bg-amber-50/90" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-14 rounded-2xl bg-orange-50/90" />
                <div className="h-14 rounded-2xl bg-amber-50/90" />
              </div>
              <div className="h-24 rounded-[1.25rem] bg-gradient-to-br from-amber-50 to-orange-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
