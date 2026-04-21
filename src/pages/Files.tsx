import { FileCode, FileText } from 'lucide-react'
import { FileCard } from '../components/FileCard'

const rows = [
  { name: 'playbook.md', meta: 'Edited 2 days ago · 12 KB', icon: FileText },
  { name: 'agent-config.json', meta: 'Edited 1 week ago · 4 KB', icon: FileCode },
  { name: 'runbook.ts', meta: 'Edited yesterday · 28 KB', icon: FileCode },
]

export function Files() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="hidden overflow-x-auto rounded-lg border border-[var(--border)] md:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--code-bg)] text-[var(--text)]">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Modified</th>
              <th className="px-4 py-2 font-medium">Size</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-h)]">
            {rows.map((row) => {
              const Icon = row.icon
              return (
              <tr key={row.name} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <Icon className="size-4 text-[var(--text)]" aria-hidden />
                    {row.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--text)]">{row.meta.split(' · ')[0].replace('Edited ', '')}</td>
                <td className="px-4 py-3 text-[var(--text)]">{row.meta.split(' · ')[1]}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <FileCard key={row.name} name={row.name} meta={row.meta} icon={row.icon} />
        ))}
      </div>
    </div>
  )
}
