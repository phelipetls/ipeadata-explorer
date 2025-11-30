import { mergeProps, useRender } from '@base-ui-components/react'
import clsx from 'clsx'

type Props = useRender.ComponentProps<'button'>

export function SearchResultItem({ render, className, ...rest }: Props) {
  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        className: clsx(
          'text-md',
          'px-3',
          'py-2',
          'w-full',
          'text-left',
          'rounded-lg',
          'transition-colors',
          'duration-300',
          'ease-in',
          'bg-option',
          'data-highlighted:bg-option-highlighted',
          className,
        ),
      },
      rest,
    ),
  })

  return element
}
