import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function SegmentGroup({ children }: Props) {
  return (
    <div className='flex flex-row bg-surface-secondary py-1 px-1 gap-1 rounded-full [&>*]:rounded-full w-fit shadow-sm'>
      {children}
    </div>
  )
}
