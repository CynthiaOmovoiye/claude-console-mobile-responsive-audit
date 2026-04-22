import clsx from 'clsx'
import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { navItems } from '../data/navItems'

type SidebarProps = {
  expanded: boolean
  onToggleExpanded: () => void
}

export function Sidebar({ expanded, onToggleExpanded }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'hidden shrink-0 flex-col border-r border-[var(--border)] border-[0.5px] transition-[width,padding,background-color] duration-300 ease-out md:flex',
        expanded
          ? 'w-60 bg-[var(--sidebar-bg)] p-3'
          : 'w-14 bg-[var(--code-bg)] p-2',
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {expanded ? (
          <div className="flex items-center justify-between gap-2 pb-1">
            <p className="font-console min-w-0 px-1 text-left text-[15px] font-normal tracking-tight text-[var(--text-h)]">
              Claude Console
            </p>
            <button
              type="button"
              onClick={onToggleExpanded}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-h)] hover:bg-[var(--surface)]"
              aria-label="Collapse sidebar"
              aria-expanded={true}
            >
              <PanelLeftClose className="size-4 shrink-0" aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggleExpanded}
            className="inline-flex size-10 shrink-0 items-center justify-center self-center rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-h)] hover:bg-[var(--surface)]"
            aria-label="Expand sidebar"
            aria-expanded={false}
          >
            <PanelLeft className="size-4 shrink-0" aria-hidden />
          </button>
        )}

        <nav
          className={clsx(
            'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto',
            expanded ? 'items-stretch' : 'items-center',
          )}
          aria-label="Primary"
        >
          {navItems.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              aria-current="page"
              title={expanded ? undefined : label}
              aria-label={label}
              className={clsx(
                'flex shrink-0 items-center rounded-md text-sm transition-colors',
                expanded
                  ? 'w-full gap-2 px-2 py-2 text-left'
                  : 'size-10 justify-center text-[var(--text-h)]',
                'bg-[var(--nav-active)] text-[var(--text-h)]',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {expanded ? <span className="min-w-0 truncate">{label}</span> : null}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
