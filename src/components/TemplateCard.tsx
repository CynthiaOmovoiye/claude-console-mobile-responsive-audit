type TemplateCardProps = {
  title: string
  description: string
  badge?: string
}

export function TemplateCard({ title, description, badge }: TemplateCardProps) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 text-left shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-medium text-[var(--text-h)]">{title}</h3>
        {badge ? (
          <span className="shrink-0 rounded-full bg-[var(--accent-bg)] px-2 py-0.5 text-xs text-[var(--text-h)]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-[var(--text)]">{description}</p>
    </article>
  )
}
