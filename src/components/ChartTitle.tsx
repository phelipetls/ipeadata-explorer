import clsx from 'clsx'

interface Props extends React.ComponentPropsWithRef<'div'> {
  children: string
}

export function ChartTitle({ children, className, ...rest }: Props) {
  return (
    <div className={clsx('text-sm font-bold text-center', className)} {...rest}>
      {children}
    </div>
  )
}
