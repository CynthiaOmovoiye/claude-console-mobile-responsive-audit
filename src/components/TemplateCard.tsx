import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

type TemplateCardProps = {
  title: string
  description: string
  badge?: string
  icons?: LucideIcon[]
  onClick?: () => void
  compact?: boolean
}

const iconTint = ['text-sky-400', 'text-violet-400', 'text-emerald-400', 'text-amber-400'] as const

export function TemplateCard({ title, description, badge, icons = [], onClick, compact }: TemplateCardProps) {
  return (
    <article
      className={clsx(
        'flex h-full flex-col rounded-xl border border-[var(--border)] hover:bg-[var(--nav-active)] text-left transition-colors',
        compact ? 'p-3' : 'p-4',
        onClick ? 'cursor-pointer hover:border-[#333333] active:opacity-90' : 'hover:border-[#333333]',
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-medium leading-snug text-[var(--text-h)]">{title}</h3>
        {badge ? (
          <span className="shrink-0 rounded-md bg-[var(--accent-bg)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text)]">{description}</p>
      {icons.length > 0 ? (
        <div className="mt-4 pt-3">
          <div className="flex flex-row items-center pl-0.5" aria-hidden>
            {icons.map((Icon, i) => (
              <span
                key={`${title}-${i}`}
                style={{ zIndex: i + 1 }}
                className={clsx(
                  'relative inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-raised)] border-[0.2px]',
                  compact ? 'size-7 -ml-2 first:ml-0' : 'size-8 -ml-2.5 first:ml-0',
                  iconTint[i % iconTint.length],
                )}
              >
                <Icon className={compact ? 'size-3.5' : 'size-4'} strokeWidth={1.75} />
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}
