import clsx from 'clsx'

type Props = React.ComponentPropsWithRef<'div'>

export function ChartTooltip({ ref, className, children, ...rest }: Props) {
  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-lg',
        'bg-surface-tooltip',
        'text-text-on-tooltip',
        'p-2',
        'pointer-events-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
