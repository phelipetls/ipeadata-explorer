import { TextField } from '@material-ui/core'
import { Event } from '@material-ui/icons'
import { DatePickerView } from '@material-ui/pickers'
import { HfKeyboardDatePicker } from 'components'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { SeriesMetadata } from 'types'

const dateViewsByPeriodicity: Record<string, DatePickerView[]> = {
  Mensal: ['year', 'month'],
  Trimestral: ['year', 'month'],
  Semestral: ['year', 'month'],
  Anual: ['year'],
  Decenal: ['year'],
  Quadrienal: ['year'],
  Quinquenal: ['year'],
}

export interface SeriesDateInputsData {
  startDate: Date
  endDate: Date
  lastN: string
}

interface Props {
  metadata: SeriesMetadata
}

export function SeriesDateInputs(props: Props) {
  const { metadata } = props

  const { register, control } = useFormContext<SeriesDateInputsData>()

  const resetDate = (date: Date | null) => {
    if (!date) return

    if (metadata.PERNOME !== 'Diária') {
      date.setDate(1)
    }

    if (metadata.PERNOME !== 'Mensal') {
      date.setMonth(0)
    }
  }

  const minDate = new Date(metadata.SERMINDATA || 0)
  const maxDate = new Date(metadata.SERMAXDATA || Date.now())

  return (
    <>
      <HfKeyboardDatePicker
        control={control}
        name='startDate'
        id='start-date'
        label='Data inicial'
        minDate={minDate}
        maxDate={maxDate}
        initialFocusedDate={maxDate}
        onAccept={resetDate}
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        keyboardIcon={<Event fontSize='small' />}
      />

      <HfKeyboardDatePicker
        control={control}
        name='endDate'
        id='end-date'
        label='Data final'
        minDate={minDate}
        maxDate={maxDate}
        initialFocusedDate={maxDate}
        onAccept={resetDate}
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        keyboardIcon={<Event fontSize='small' />}
      />

      <TextField
        inputRef={register}
        type='number'
        name='lastN'
        id='last-n'
        variant='outlined'
        label='Últimos N'
      />
    </>
  )
}
