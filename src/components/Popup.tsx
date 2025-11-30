import { mergeProps, useRender } from '@base-ui-components/react'

type Props = useRender.ComponentProps<'div'>

export function Popup({ render, ...rest }: Props) {
  const element = useRender({
    render,
    props: mergeProps<'div'>(
      {
        className:
          'bg-surface-popup rounded-lg shadow-md border border-outline',
      },
      rest,
    ),
  })

  return element
}
