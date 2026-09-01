import clsx from 'clsx'
import { FileQuestion } from 'lucide-react'

interface EmptyStateProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string
  description: string
  isCentered?: boolean
  action?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  action,
  className,
  isCentered,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx({ 'flex flex-col items-center': isCentered }, className)}
      {...props}
    >
      <div className='inline-block p-3 rounded-full bg-gray-100 mb-4'>
        <FileQuestion className='w-8 h-8 text-gray-500' />
      </div>

      <div className='text-lg font-bold mb-1 text-gray-900'>{title}</div>
      <p
        className={clsx(
          'text-sm text-gray-500 max-w-sm mb-6',
          isCentered && 'text-center',
        )}
      >
        {description}
      </p>

      {action}
    </div>
  )
}
