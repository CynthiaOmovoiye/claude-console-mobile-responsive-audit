import { TemplateCard } from '../components/TemplateCard'

export function Quickstart() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:gap-10">
      <section className="min-w-0 flex-1 space-y-4">
        <h2 className="text-2xl font-medium text-[var(--text-h)]">What do you want to build?</h2>
        <input
          type="text"
          placeholder="Describe a task…"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)] placeholder:text-[var(--text)]"
        />
      </section>
      <section className="min-w-0 flex-1 space-y-4">
        <h2 className="text-lg font-medium text-[var(--text-h)]">Browse templates</h2>
        <input
          type="search"
          placeholder="Search templates"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)] placeholder:text-[var(--text)]"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TemplateCard
            title="Support agent"
            description="Triages tickets and drafts replies for human review."
            badge="Popular"
          />
          <TemplateCard title="Research assistant" description="Summarizes sources with citations." />
          <TemplateCard title="Code reviewer" description="Suggests fixes and explains risk areas." />
        </div>
      </section>
    </div>
  )
}
