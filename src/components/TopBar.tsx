import { Menu } from 'lucide-react'

type TopBarProps = {
  title: string
  onMenuClick: () => void
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--sidebar-bg)] px-3 py-3 md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex size-11 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-h)] hover:bg-[var(--surface)]"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-left text-lg font-medium text-[var(--text-h)]">{title}</h1>
    </header>
  )
}
