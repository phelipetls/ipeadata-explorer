import { TableContainer } from './table/TableContainer'
import { Table } from './table/Table'
import { TableHead } from './table/TableHead'
import { TableRow } from './table/TableRow'
import { TableCell } from './table/TableCell'
import { TableHeaderCell } from './table/TableHeaderCell'
import { TableBody } from './table/TableBody'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import clsx from 'clsx'

interface Props {
  rows: string[][]
  className?: string
}

const ROW_HEIGHT = 40
const VISIBLE_ROWS = 10
const BORDER_WIDTH = 1

export function SeriesTable({ rows, className }: Props) {
  const [header = [], ...dataRows] = rows

  const parentRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  const hasScrolled = virtualizer.scrollOffset
    ? virtualizer.scrollOffset > 0
    : false

  const virtualRows = virtualizer.getVirtualItems()
  const [before, after] =
    virtualRows.length > 0
      ? [
          notUndefined(virtualRows[0]).start - virtualizer.options.scrollMargin,
          virtualizer.getTotalSize() - notUndefined(virtualRows.at(-1)).end,
        ]
      : [0, 0]

  return (
    <TableContainer
      style={
        {
          '--cell-height': `${ROW_HEIGHT}px`,
          '--max-table-height': `${ROW_HEIGHT * VISIBLE_ROWS}px`,
          '--border-size': `${BORDER_WIDTH}px`,
        } as React.CSSProperties
      }
      ref={parentRef}
      className={clsx('max-h-(--max-table-height) overflow-auto', className)}
    >
      <div
        ref={scrollContainerRef}
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <Table>
          <colgroup>
            {header.map((_, index) => (
              <col className={clsx({ 'min-w-[160px]': index === 0 })} />
            ))}
          </colgroup>

          {header.length > 0 && (
            <TableHead>
              <TableRow>
                {header.map((value) => (
                  <TableHeaderCell
                    key={value}
                    className='sticky top-0 box-border h-(--cell-height)'
                    {...(hasScrolled && { 'data-sticky': '' })}
                  >
                    {value}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {before > 0 && (
              <tr>
                <td colSpan={header.length} style={{ height: before }} />
              </tr>
            )}

            {virtualRows.map((virtualRow, rowIndex) => {
              const row = dataRows[virtualRow.index]
              if (!row) {
                return null
              }
              return (
                <TableRow key={String(row[0])}>
                  {row.map((cell, columnIndex) => (
                    <TableCell
                      key={`row-${rowIndex}-column-${columnIndex}-value:${String(cell)}`}
                      className='box-border h-(--cell-height)'
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}

            {after > 0 && (
              <tr>
                <td colSpan={header.length} style={{ height: after }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  )
}
