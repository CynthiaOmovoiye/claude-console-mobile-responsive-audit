import type { LucideIcon } from 'lucide-react'
import { BarChart3, Bot, FolderOpen, LayoutDashboard } from 'lucide-react'

export type PageId = 'quickstart' | 'workbench' | 'files' | 'analytics'

export type NavItem = {
  id: PageId
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { id: 'quickstart', label: 'Quickstart', icon: Bot },
  { id: 'workbench', label: 'Workbench', icon: LayoutDashboard },
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]
