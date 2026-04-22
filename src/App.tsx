import { useState } from 'react'
import { AppShell } from './components/AppShell'
import type { PageId } from './data/navItems'
import { Analytics } from './pages/Analytics'
import { Files } from './pages/Files'
import { Quickstart } from './pages/Quickstart'
import { Workbench } from './pages/Workbench'

function renderPage(id: PageId) {
  switch (id) {
    case 'quickstart':
      return <Quickstart />
    case 'workbench':
      return <Workbench />
    case 'files':
      return <Files />
    case 'analytics':
      return <Analytics />
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('quickstart')

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{renderPage(activePage)}</div>
    </AppShell>
  )
}
