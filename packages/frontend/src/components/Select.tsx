import { Select as BaseSelect } from '@base-ui-components/react/select'
import { Check } from 'lucide-react'
import { type ButtonProps } from './Button'
import clsx from 'clsx'
import { SelectButton } from './SelectButton'
import { twMerge } from 'tailwind-merge'
import { Popup } from './Popup'

type BaseProps<TValue extends string = string> = {
  placeholder?: string
  options: { value: TValue; label: string; group?: string }[]
} & (
  | {
      isMultiple: false
      value: TValue
      onChange: (value: TValue) => void
    }
  | {
      isMultiple: true
      value: TValue[]
      onChange: (value: TValue[]) => void
    }
)

type Props<TValue extends string = string> = BaseProps<TValue> &
  Omit<ButtonProps, keyof BaseProps>

const omitOwnProps = <TValue extends string = string>(props: Props<TValue>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isMultiple, value, onChange, options, placeholder, ...rest } = props
  return rest
}

export function Select<TValue extends string = string>(props: Props<TValue>) {
  let label = props.placeholder

  const getSelectedOption = () =>
    props.options.find((o) =>
      Array.isArray(props.value)
        ? props.value.includes(o.value)
        : o.value === props.value,
    )

  if (props.isMultiple) {
    if (Array.isArray(props.value)) {
      const sample = props.value
        .slice(0, 3)
        .map((value) => getSelectedOption()?.label ?? value)
      label = `${sample.join(', ')} ${props.value.length > sample.length ? '...' : ''}`
    }
  } else if (props.value !== '') {
    const option = getSelectedOption()
    label = option?.label ?? String(props.value)
  }

  const isEmpty = label === props.placeholder

  const groupedOptions = props.options.reduce(
    (acc, opt) => {
      const group = opt.group || ''
      if (!acc[group]) acc[group] = []
      acc[group].push(opt)
      return acc
    },
    {} as Record<string, { value: TValue; label: string; group?: string }[]>,
  )

  const sortedGroupKeys = Object.keys(groupedOptions)

  return (
    <>
      <SelectButton
        render={<div />}
        {...omitOwnProps(props)}
        className={clsx('lg:hidden', props.className)}
      >
        <select
          multiple={props.isMultiple}
          value={props.value}
          onChange={(e) => {
            const newValue = e.target.value

            if (props.isMultiple) {
              const value = props.value
              const updatedValue = value.includes(newValue as TValue)
                ? value.filter((v) => v !== newValue)
                : [...value, newValue]
              props.onChange(updatedValue as TValue[])
              return
            }

            props.onChange(newValue as TValue)
          }}
        >
          {sortedGroupKeys.map((group) =>
            group ? (
              <optgroup label={group} key={group}>
                {groupedOptions[group]!.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              groupedOptions[group]!.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            ),
          )}
        </select>
      </SelectButton>

      <BaseSelect.Root
        items={props.options}
        value={props.value}
        onValueChange={(value) => {
          // @ts-expect-error this type does not narrow based on multiple prop so we won't bother either
          props.onChange(value)
        }}
        multiple={props.isMultiple}
      >
        <BaseSelect.Trigger
          nativeButton
          render={
            <SelectButton
              {...omitOwnProps(props)}
              className={twMerge(
                clsx(
                  'hidden lg:grid',
                  isEmpty && 'text-text-secondary',
                  props.className,
                ),
              )}
            />
          }
        >
          <BaseSelect.Value>{label}</BaseSelect.Value>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={8} alignItemWithTrigger={false}>
            <BaseSelect.Popup
              render={
                <Popup className='px-2 py-2 min-w-(--anchor-width) overflow-auto max-h-[calc(var(--available-height)_-_16px)] rounded-full border-none' />
              }
            >
              <BaseSelect.List className='bg-surface-primary space-y-2'>
                {sortedGroupKeys.map((group) =>
                  group ? (
                    <BaseSelect.Group key={group}>
                      <BaseSelect.GroupLabel className='px-3 py-2 text-sm font-medium text-text-secondary'>
                        {group}
                      </BaseSelect.GroupLabel>
                      {groupedOptions[group]!.map((option) => (
                        <BaseSelect.Item
                          key={option.value}
                          value={option.value}
                          className={clsx(
                            'select-none',
                            'rounded-lg',
                            'px-3',
                            'py-2',
                            'bg-option',
                            'data-highlighted:bg-option-highlighted',
                            'grid',
                            'grid-cols-[1em_1fr]',
                            'gap-2',
                            'items-center',
                            'text-sm',
                          )}
                        >
                          <BaseSelect.ItemIndicator>
                            <Check className='w-[1em] h-[1em] col-1 stroke-accent' />
                          </BaseSelect.ItemIndicator>

                          <BaseSelect.ItemText className={clsx('col-2')}>
                            {option.label}
                          </BaseSelect.ItemText>
                        </BaseSelect.Item>
                      ))}
                    </BaseSelect.Group>
                  ) : (
                    <>
                      {groupedOptions[group]!.map((option) => (
                        <BaseSelect.Item
                          key={option.value}
                          value={option.value}
                          className={clsx(
                            'select-none',
                            'rounded-lg',
                            'px-3',
                            'py-2',
                            'bg-option',
                            'data-highlighted:bg-option-highlighted',
                            'grid',
                            'grid-cols-[1em_1fr]',
                            'gap-2',
                            'items-center',
                            'text-sm',
                          )}
                        >
                          <BaseSelect.ItemIndicator>
                            <Check className='w-[1em] h-[1em] col-1 stroke-accent' />
                          </BaseSelect.ItemIndicator>

                          <BaseSelect.ItemText className={clsx('col-2')}>
                            {option.label}
                          </BaseSelect.ItemText>
                        </BaseSelect.Item>
                      ))}
                    </>
                  ),
                )}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </>
  )
}
