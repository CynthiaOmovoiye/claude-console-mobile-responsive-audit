type MetricCardProps = {
  label: string
  value: string
  hint?: string
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-sm">
      <p className="text-sm text-[var(--text)]">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums text-[var(--text-h)]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[var(--text)]">{hint}</p> : null}
    </article>
  )
}
