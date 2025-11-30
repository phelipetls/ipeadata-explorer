import clsx from 'clsx'

interface SkeletonProps extends React.ComponentPropsWithoutRef<'span'> {
  count?: number
}

export function Skeleton({
  count = 1,
  children,
  className,
  ...rest
}: SkeletonProps) {
  return Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={clsx(
        'inline-block text-transparent bg-zinc-300 select-none animate-pulse rounded-full h-[1lh] min-h-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ))
}
