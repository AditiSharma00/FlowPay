import type { PropsWithChildren, ReactNode } from 'react'

type SectionCardProps = PropsWithChildren<{
  title: string
  description?: string
  className?: string
  bodyClassName?: string
  action?: ReactNode
}>

export function SectionCard({
  title,
  description,
  className = '',
  bodyClassName = '',
  action,
  children,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[2rem] border border-amber-100/80 bg-white/80 p-5 shadow-[0_20px_50px_-35px_rgba(180,83,9,0.35)] backdrop-blur-sm ${className}`.trim()}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500" />
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
