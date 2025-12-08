import {
  ArrowUpDown,
  ArrowUp10,
  ArrowDown01,
  ArrowUpAZ,
  ArrowDownZA,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from 'lucide-react'
import type { ReactNode } from 'react'

type SortDirection = 'asc' | 'desc' | 'none'
type DataType = 'any' | 'string' | 'number'

type Props = {
  value: SortDirection
  onChange: (value: SortDirection) => void
  dataType: DataType
  children?: React.ReactNode
}

const cycle = ['asc', 'desc', 'none'] as const

const sortIconMap: Record<DataType, Record<SortDirection, ReactNode>> = {
  any: {
    asc: <ArrowUpNarrowWide />,
    desc: <ArrowDownNarrowWide />,
    none: <ArrowUpDown />,
  },
  string: {
    asc: <ArrowUpAZ />,
    desc: <ArrowDownZA />,
    none: <ArrowUpDown />,
  },
  number: {
    asc: <ArrowUp10 />,
    desc: <ArrowDown01 />,
    none: <ArrowUpDown />,
  },
}

export function SeriesTableCellSortableContent({
  value,
  onChange,
  dataType,
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
        {sortIconMap[dataType][value]}
      </div>
    </button>
  )
}
