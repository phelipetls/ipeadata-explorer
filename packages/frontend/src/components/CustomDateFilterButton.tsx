import * as React from 'react'
import { Popover } from '@base-ui-components/react/popover'
import { Button } from './Button'
import { Popup } from './Popup'
import { format, parse } from 'date-fns'
import { Input } from './Input'
import z from 'zod'
import { useState } from 'react'
import { Form } from '@base-ui-components/react'

type BaseProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValue: [Date, Date]
  onSubmit: (value: [Date, Date]) => void
  minDate: Date
  maxDate: Date
}

type Props = BaseProps & Omit<Popover.Trigger.Props, keyof BaseProps>

const formatDateAsInputValue = (date: Date) => format(date, 'yyyy-MM-dd')
const parseDateInputValue = (str: string) =>
  parse(str, 'yyyy-MM-dd', new Date())

const displayDate = (date: Date) => format(date, 'dd/MM/yyyy')

export function CustomDateFilterButton({
  open,
  onOpenChange,
  defaultValue,
  onSubmit,
  minDate,
  maxDate,
  ...triggerProps
}: Props) {
  const [startDate, setStartDate] = React.useState(
    formatDateAsInputValue(defaultValue[0]),
  )
  const [endDate, setEndDate] = React.useState(
    formatDateAsInputValue(defaultValue[1]),
  )
  const [errors, setErrors] = useState<Record<string, string[]>>({
    startDate: [''],
    endDate: [''],
  })

  const dateUnderflowErrorMessage = `Mínimo: ${displayDate(minDate)}`
  const dateOverflowErrorMessage = `Máximo: ${displayDate(minDate)}`

  const formSchema = z.object({
    startDate: z
      .date()
      .min(minDate, { error: dateUnderflowErrorMessage })
      .max(maxDate, { error: dateOverflowErrorMessage }),
    endDate: z
      .date()
      .min(minDate, { error: dateUnderflowErrorMessage })
      .max(maxDate, { error: dateOverflowErrorMessage }),
  })

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger {...triggerProps} />

      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup
            render={
              <Popup
                render={
                  <Form
                    className='p-4'
                    errors={errors}
                    onClearErrors={() => setErrors({})}
                    onSubmit={(e) => {
                      e.preventDefault()

                      const formData = new FormData(e.currentTarget)
                      const formValues = Object.fromEntries(
                        [...formData].map(([key, value]) => [
                          key,
                          parseDateInputValue(value as string),
                        ]),
                      )

                      const result = formSchema.safeParse(formValues)

                      if (result.error) {
                        const { fieldErrors } = z.flattenError(result.error)
                        setErrors(fieldErrors)
                        return
                      }

                      onSubmit([result.data.startDate, result.data.endDate])
                      onOpenChange(false)
                    }}
                  />
                }
              />
            }
          >
            <Popover.Title className='text-base font-semibold mb-3'>
              Período Customizado
            </Popover.Title>

            <div className='space-y-3'>
              <Input
                label='Data inicial'
                name='startDate'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                errorMessage={errors['startDate']?.[0] ?? ''}
              />

              <Input
                label='Data final'
                name='endDate'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                errorMessage={errors['endDate']?.[0] ?? ''}
              />
            </div>

            <div className='flex gap-2 mt-4'>
              <Button className='w-full' variant='solid' type='submit'>
                Aplicar
              </Button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
