export function Workbench() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1fr_260px]">
      <section className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <h2 className="text-lg font-medium text-[var(--text-h)]">Session</h2>
        <p className="mt-2 text-sm text-[var(--text)]">
          Primary workspace panel. On mobile this stacks above context so the main surface stays readable.
        </p>
        <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--code-bg)] p-3 font-mono text-xs text-[var(--text-h)]">
          User: outline the rollout plan.
          <br />
          Assistant: here is a concise plan with milestones…
        </div>
      </section>
      <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm md:min-w-0">
        <h2 className="text-lg font-medium text-[var(--text-h)]">Context</h2>
        <p className="mt-2 text-sm text-[var(--text)]">
          Secondary panel for tools, settings, or metadata. Narrow side-by-side layouts collapse here on small
          screens.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text)]">
          <li>Project: Demo workspace</li>
          <li>Model: Prototype</li>
        </ul>
      </aside>
    </div>
  )
}
