import React from 'react'
import { createPortal } from 'react-dom'
import { useChartContext } from '../context/ChartContext'
import clsx from 'clsx'

type CategoricalLegendItem = {
  color: string
  label: string
}

type Props = React.ComponentPropsWithRef<'ul'> & {
  items: CategoricalLegendItem[]
  position: { x: number; y: number }
}

export function CategoricalLegend({
  items,
  position,
  className,
  ...rest
}: Props) {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } =
    useChartContext()

  const x = marginLeft + (width - marginLeft - marginRight) / 2 - marginRight
  const y = marginTop + height - marginBottom

  return createPortal(
    <ul
      style={
        {
          left: `${position.x + x}px`,
          top: `${position.y + y}px`,
          transform: `translate(-50%, 0)`,
        } as React.CSSProperties
      }
      className={clsx(
        'absolute flex flex-row flex-wrap justify-center gap-2',
        className,
      )}
      {...rest}
    >
      {items.map((item) => {
        return (
          <li key={item.label} className='flex flex-row gap-2 items-center'>
            <span
              style={{ backgroundColor: item.color }}
              className='size-[8px] rounded-full'
            />
            <span className='text-sm'>{item.label}</span>
          </li>
        )
      })}
    </ul>,
    document.getElementById('root')!,
  )
}
