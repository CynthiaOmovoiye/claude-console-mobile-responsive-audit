import { AppShell } from './components/AppShell'
import { Quickstart } from './pages/Quickstart'

export default function App() {
  return (
    <AppShell>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Quickstart />
      </div>
    </AppShell>
  )
}
