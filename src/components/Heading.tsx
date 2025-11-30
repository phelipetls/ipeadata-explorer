import clsx from 'clsx'

type Props = React.ComponentPropsWithoutRef<'h1'>

export function Heading({ className, ...rest }: Props) {
  return (
    <h1 className={clsx('font-bold', 'text-accent', className)} {...rest}>
      Ipeadata Explorer
    </h1>
  )
}
