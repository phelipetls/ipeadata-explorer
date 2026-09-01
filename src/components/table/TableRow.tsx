import clsx from 'clsx'

interface Props extends React.ComponentPropsWithoutRef<'tr'> {
  children: React.ReactNode
}

export function TableRow({ children, className, ...rest }: Props) {
  return (
    <tr
      className={clsx(
        '[&_td,th]:border-t-(length:--border-size) last:[&_td]:border-b-(length:--border-size) [&_th]:data-sticky:border-b-(length:--border-size)',
        '[&_td,th]:border-l-(length:--border-size) [&_td,th]:last:border-r-(length:--border-size)',
        '[&_td,th]:last:border-r-(length:--border-size)',
        '[&_td,th]:border-table-border',
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  )
}
