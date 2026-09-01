import { useState } from 'react'
import { format, parse } from 'date-fns'
import { Input } from './Input'
import { BottomSheet } from './BottomSheet'
import { FilterButtonGroup } from './FilterButtonGroup'
import { FilterButton } from './FilterButton'
import type { DateRangePreset } from '../types'
import { SelectButton } from './SelectButton'

interface Props {
  dateRangePresets: DateRangePreset[]
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

const formatDateAsInputValue = (date: Date) => format(date, 'yyyy-MM-dd')
const parseDateInputValue = (str: string) =>
  parse(str, 'yyyy-MM-dd', new Date())
const displayDate = (date: Date) => format(date, 'dd/MM/yyyy')

export function MobileDateFilterButton({
  dateRangePresets,
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  const [startDate, setStartDate] = useState(
    formatDateAsInputValue(value.startDate),
  )
  const [endDate, setEndDate] = useState(formatDateAsInputValue(value.endDate))

  const [errors, setErrors] = useState<Record<string, string[]>>({
    startDate: [],
    endDate: [],
  })

  const handleDateChange = (
    newDate: Date,
    fieldName: 'startDate' | 'endDate',
  ) => {
    let error = ''
    if (newDate > maxDate) {
      error = `Máximo: ${displayDate(maxDate)}`
    } else if (newDate < minDate) {
      error = `Mínimo: ${displayDate(minDate)}`
    }

    if (error) {
      return setErrors({
        ...errors,
        [fieldName]: [error],
      })
    }

    onChange({
      ...value,
      preset: 'custom',
      [fieldName]: newDate,
    })
  }

  const selectedPreset = dateRangePresets.find((p) => p.label === value.preset)

  const buttonText = selectedPreset
    ? selectedPreset.longLabel
    : value.preset === 'custom'
      ? `De ${displayDate(value.startDate)} a ${displayDate(value.endDate)}`
      : value.preset

  return (
    <BottomSheet
      open={open}
      onOpenChange={setOpen}
      title='Selecione o período'
      renderTrigger={
        <SelectButton className={className}>Período: {buttonText}</SelectButton>
      }
    >
      <FilterButtonGroup className='flex-wrap mb-4'>
        {dateRangePresets.map((preset) => (
          <FilterButton
            size='small'
            key={preset.label}
            isSelected={value.preset === preset.label}
            onClick={() => {
              onChange({
                preset: preset.label,
                startDate: preset.startDate,
                endDate: preset.endDate,
              })
              setOpen(false)
            }}
          >
            {preset.label}
          </FilterButton>
        ))}
      </FilterButtonGroup>

      <div className='flex flex-col gap-2'>
        <Input
          label='Data inicial'
          name='startDate'
          type='date'
          value={startDate}
          onChange={(e) => {
            const inputValue = e.target.value
            setStartDate(inputValue)
            handleDateChange(parseDateInputValue(inputValue), 'startDate')
          }}
          className='w-full'
          errorMessage={errors['startDate']?.[0] ?? ''}
        />

        <Input
          label='Data final'
          name='endDate'
          type='date'
          value={endDate}
          onChange={(e) => {
            const inputValue = e.target.value
            setEndDate(inputValue)
            handleDateChange(parseDateInputValue(inputValue), 'endDate')
          }}
          className='w-full'
          errorMessage={errors['endDate']?.[0] ?? ''}
        />
      </div>
    </BottomSheet>
  )
}
