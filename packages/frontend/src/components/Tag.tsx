import { mergeProps, useRender } from '@base-ui-components/react'

type Props = useRender.ComponentProps<'span'>

export function Tag({ ...rest }: Props) {
  const element = useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className:
          'inline whitespace-nowrap bg-surface-secondary shadow-xs border-1 border-outline text-sm rounded-full px-3 py-1 text-text-secondary',
      },
      rest,
    ),
  })

  return element
}
