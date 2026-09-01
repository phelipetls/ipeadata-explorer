import * as React from 'react'
import { Dialog } from '@base-ui-components/react/dialog'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: React.ReactNode
  renderTrigger?: React.ReactElement<Record<string, unknown>>
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  renderTrigger,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger render={renderTrigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <Dialog.Popup className='fixed bottom-0 left-0 right-0 bg-surface-popup rounded-t-2xl z-50 p-6 max-h-[85vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'>
          {title && (
            <Dialog.Title className='text-lg font-semibold mb-4 text-text-primary'>
              {title}
            </Dialog.Title>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
