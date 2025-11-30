import clsx from 'clsx'

export function SeriesDataFilterItem({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('flex flex-col gap-1', className)} {...rest}>
      {children}
    </div>
  )
}
