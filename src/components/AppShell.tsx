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
    <div className="flex min-h-dvh w-full flex-col bg-[var(--bg)] md:flex-row">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        expanded={desktopSidebarExpanded}
        onToggleExpanded={() => setDesktopSidebarExpanded((v) => !v)}
      />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <TopBar title={title} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 min-w-0 p-4 text-left">{children}</main>
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
