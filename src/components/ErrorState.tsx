import clsx from 'clsx'
import { TriangleAlert } from 'lucide-react'

interface ErrorStateProps extends React.ComponentPropsWithoutRef<'div'> {
  title: string
  description: string
  isCentered?: boolean
  retry?: () => void
}

export function ErrorState({
  title,
  description,
  retry,
  className,
  isCentered,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={clsx({ 'flex flex-col items-center': isCentered }, className)}
      {...props}
    >
      <div className='inline-block p-3 rounded-full bg-red-50 mb-4'>
        <TriangleAlert className='w-8 h-8 text-red-500' />
      </div>

      <div className='text-lg font-bold mb-1'>{title}</div>
      <p
        className={clsx(
          'text-sm text-text-secondary max-w-sm mb-6',
          isCentered && 'text-center',
        )}
      >
        {description}
      </p>

      {retry && (
        <button
          onClick={retry}
          className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}
