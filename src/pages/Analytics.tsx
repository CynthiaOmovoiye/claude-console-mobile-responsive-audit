import { MetricCard } from '../components/MetricCard'

export function Analytics() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Requests (7d)" value="12.4k" hint="Within typical range for this workspace." />
        <MetricCard label="Tokens (7d)" value="3.1M" hint="Includes retries and tool calls." />
        <MetricCard label="Error rate" value="0.4%" hint="5xx and client timeouts combined." />
      </div>
      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <h2 className="text-lg font-medium text-[var(--text-h)]">Usage trend</h2>
        <p className="mt-1 text-sm text-[var(--text)]">Placeholder chart block. Cards stack on mobile; chart stays full width.</p>
        <div
          className="mt-4 h-48 w-full rounded-md bg-[var(--code-bg)]"
          role="img"
          aria-label="Placeholder chart"
        />
      </section>
    </div>
  )
}
