import { Input as UnstyledInput } from '@base-ui-components/react/input'
import { Field } from '@base-ui-components/react/field'
import clsx from 'clsx'

interface Props extends React.ComponentPropsWithRef<'input'> {
  label: string
  errorMessage?: string
}

export function Input({
  name,
  label,
  errorMessage,
  className,
  ...rest
}: Props) {
  return (
    <Field.Root name={name} invalid={!!errorMessage}>
      <Field.Label className='block text-sm font-medium mb-1'>
        {label}
      </Field.Label>

      <UnstyledInput
        name={name}
        className={clsx(
          'bg-surface-input px-3 py-2 border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
          className,
        )}
        {...rest}
      />

      <Field.Error className='text-xs text-text-error mt-1' />
    </Field.Root>
  )
}
