import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers'
import * as React from 'react'
import { Controller, ControllerProps } from 'react-hook-form'

type Props = Required<
  Pick<ControllerProps<typeof KeyboardDatePicker>, 'control' | 'name'>
> &
  Omit<KeyboardDatePickerProps, 'value' | 'onChange'>

export const HfKeyboardDatePicker: React.FC<Props> = (props) => {
  const [date, setDate] = React.useState<Date | null>(null)

  const { name, control, ...rest } = props

  return (
    <Controller
      control={control}
      name={name}
      value={date}
      onChange={setDate}
      render={({ name, value, onChange }) => {
        return (
          <KeyboardDatePicker
            {...rest}
            name={name}
            value={value}
            onChange={onChange}
            autoOk
            inputVariant='outlined'
            format='dd/MM/yyyy'
            mask='__/__/____'
            clearable
          />
        )
      }}
    />
  )
}
