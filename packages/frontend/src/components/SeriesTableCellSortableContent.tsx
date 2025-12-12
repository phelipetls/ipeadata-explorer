import {
  ArrowUpDown,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from 'lucide-react'
import type { ReactNode } from 'react'

type SortDirection = 'asc' | 'desc' | 'none'

type Props = {
  value: SortDirection
  onChange: (value: SortDirection) => void
  children?: React.ReactNode
}

const cycle = ['asc', 'desc', 'none'] as const

const sortIconMap: Record<SortDirection, ReactNode> = {
  asc: <ArrowUpNarrowWide />,
  desc: <ArrowDownNarrowWide />,
  none: <ArrowUpDown />,
}

export function SeriesTableCellSortableContent({
  value,
  onChange,
  children,
}: Props) {
  return (
    <button
      className='w-full h-full flex flex-row justify-between items-center gap-2 appearance-none'
      onClick={() => {
        const nextIndex = cycle.findIndex((v) => v === value) + 1
        onChange(cycle[nextIndex % cycle.length] ?? 'none')
      }}
    >
      {children}
      <div className='shrink-0 [&_svg]:w-4 [&_svg]:h-4'>
        {sortIconMap[value]}
      </div>
    </button>
  )
}
