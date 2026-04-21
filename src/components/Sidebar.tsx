import clsx from 'clsx'
import { navItems, type PageId } from '../data/navItems'

type SidebarProps = {
  activePage: PageId
  onNavigate: (id: PageId) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg)] p-3 md:flex">
      <p className="px-2 pb-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--text)]">
        Console
      </p>
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = id === activePage
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={clsx(
                'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                active
                  ? 'bg-[var(--accent-bg)] text-[var(--text-h)]'
                  : 'text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
