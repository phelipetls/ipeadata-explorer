import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { mergeProps, useRender } from '@base-ui-components/react'

type Props = useRender.ComponentProps<'button'>

export function SelectButton({ render, children, className, ...rest }: Props) {
  const element = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        className: clsx(
          'flex items-center justify-between',
          'bg-surface-secondary',
          'rounded-full',
          'px-4 py-2 text-sm font-medium',
          'shadow-sm',
          'hover:bg-surface-secondary-hover',
          'transition-colors',
          'disabled:cursor-not-allowed',
          'grid',
          'grid-cols-[minmax(96px,1fr)_auto]',
          'gap-2',
          '[&_select]:appearance-none',
          '[&_select]:row-1',
          '[&_select]:col-span-full',
          'lg:justify-items-start',
          className,
        ),
        children: (
          <>
            {typeof children === 'string' ? (
              <span className='text-center'>{children}</span>
            ) : (
              children
            )}
            <div className={clsx('pointer-events-none row-1 col-1 col-2')}>
              <ChevronDown size={20} className='text-text-secondary' />
            </div>
          </>
        ),
      },
      rest,
    ),
  })

  return element
}
