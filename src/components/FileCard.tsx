import type { LucideIcon } from 'lucide-react'

type FileCardProps = {
  name: string
  meta: string
  icon: LucideIcon
}

export function FileCard({ name, meta, icon: Icon }: FileCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-left shadow-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[var(--code-bg)] text-[var(--text-h)]">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--text-h)]">{name}</p>
        <p className="truncate text-sm text-[var(--text)]">{meta}</p>
      </div>
    </article>
  )
}
