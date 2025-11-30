import { mergeProps, useRender } from '@base-ui-components/react'
import clsx from 'clsx'

type Props = useRender.ComponentProps<'div'>

export function FilterButtonGroup({
  render,
  children,
  className,
  ...rest
}: Props) {
  const element = useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: clsx('flex flex-row gap-2', className),
        children,
      },
      rest,
    ),
  })

  return element
}
