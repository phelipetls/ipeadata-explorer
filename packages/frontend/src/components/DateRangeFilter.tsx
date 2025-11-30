import { useState } from 'react'
import { CustomDateFilterButton } from './CustomDateFilterButton'
import { MobileDateFilterButton } from './MobileDateFilterButton'
import type { DateRangePreset } from '../types'
import clsx from 'clsx'
import { SegmentGroup } from './SegmentGroup'
import { SegmentGroupItem } from './SegmentGroupItem'

interface Props {
  dateRangePresets: Array<DateRangePreset>
  value: {
    preset: string
    startDate: Date
    endDate: Date
  }
  onChange: (filter: { preset: string; startDate: Date; endDate: Date }) => void
  minDate: Date
  maxDate: Date
  className?: string
}

export function DateRangeFilter({
  dateRangePresets,
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={clsx('lg:hidden', className)}>
        <MobileDateFilterButton
          dateRangePresets={dateRangePresets}
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          className='w-full'
        />
      </div>

      <div className={clsx('hidden lg:flex', className)}>
        <SegmentGroup>
          {dateRangePresets.map((preset) => (
            <SegmentGroupItem
              key={preset.label}
              value={preset.label}
              isSelected={preset.label === value.preset}
              onClick={() => {
                onChange({
                  startDate: preset.startDate,
                  endDate: preset.endDate,
                  preset: preset.label,
                })
              }}
            >
              {preset.label}
            </SegmentGroupItem>
          ))}

          <CustomDateFilterButton
            key={JSON.stringify(value)}
            open={open}
            onOpenChange={setOpen}
            render={
              <SegmentGroupItem isSelected={value.preset === 'custom'}>
                Customizado
              </SegmentGroupItem>
            }
            minDate={minDate}
            maxDate={maxDate}
            defaultValue={[value.startDate, value.endDate]}
            onSubmit={([startDate, endDate]) => {
              onChange({
                preset: 'custom',
                startDate,
                endDate,
              })
            }}
          />
        </SegmentGroup>
      </div>
    </>
  )
}
