import clsx from 'clsx'

export function SeriesDataFilterGroup({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('full-bleed grid-app overflow-x-auto', className)}>
      <div className={'flex flex-row gap-2 pb-1'} {...rest}>
        {children}
      </div>
    </div>
  )
}
