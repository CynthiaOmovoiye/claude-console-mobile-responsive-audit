import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { navItems, type PageId } from '../data/navItems'

type MobileDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activePage: PageId
  onNavigate: (id: PageId) => void
}

export function MobileDrawer({ open, onOpenChange, activePage, onNavigate }: MobileDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-drawer-overlay fixed inset-0 z-40 bg-black/50 md:hidden" />
        <Dialog.Content className="mobile-drawer-panel fixed inset-y-0 left-0 z-50 flex w-[min(100vw,18rem)] flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-4 shadow-lg outline-none md:hidden">
          <div className="mb-4 flex items-center justify-between gap-2">
            <Dialog.Title className="text-left text-base font-medium text-[var(--text-h)]">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-h)] hover:bg-[var(--surface)]"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Navigate between console sections.</Dialog.Description>
          <nav className="flex flex-col gap-1" aria-label="Primary mobile">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = id === activePage
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onNavigate(id)
                    onOpenChange(false)
                  }}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                    active
                      ? 'bg-[var(--nav-active)] text-[var(--text-h)]'
                      : 'text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--text-h)]',
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </button>
              )
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
