import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'

type SortType = 'asc' | 'desc' | 'none'

type Props = {
  value: SortType
  onChange: (value: SortType) => void
  children?: React.ReactNode
}

const cycle = ['asc', 'desc', 'none'] as const

const sortTypeIconMap = {
  asc: <ArrowUp className='w-4 h-4' />,
  desc: <ArrowDown className='w-4 h-4' />,
  none: <ChevronsUpDown className='w-4 h-4 opacity-50' />,
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
      {sortTypeIconMap[value]}
    </button>
  )
}
