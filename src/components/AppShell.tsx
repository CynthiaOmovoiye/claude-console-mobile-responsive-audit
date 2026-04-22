import { useState, type ReactNode } from 'react'
import { navItems, type PageId } from '../data/navItems'
import { MobileDrawer } from './MobileDrawer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type AppShellProps = {
  activePage: PageId
  onNavigate: (id: PageId) => void
  children: ReactNode
}

export function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true)
  const title = navItems.find((item) => item.id === activePage)?.label ?? 'Console'

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 w-full flex-1 flex-col overflow-hidden bg-[var(--bg)] md:h-auto md:max-h-none md:min-h-dvh md:flex-row md:overflow-visible">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        expanded={desktopSidebarExpanded}
        onToggleExpanded={() => setDesktopSidebarExpanded((v) => !v)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:min-h-dvh">
        <TopBar title={title} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-[var(--bg)] px-4 py-4 text-left md:overflow-visible md:px-8 md:py-8">
          {children}
        </main>
      </div>
      <MobileDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activePage={activePage}
        onNavigate={onNavigate}
      />
    </div>
  )
}
