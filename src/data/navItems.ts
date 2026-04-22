import type { LucideIcon } from 'lucide-react'
import { Bot } from 'lucide-react'

export type PageId = 'quickstart'

export type NavItem = {
  id: PageId
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [{ id: 'quickstart', label: 'Quickstart', icon: Bot }]
