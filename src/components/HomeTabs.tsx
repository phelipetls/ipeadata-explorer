import { Tabs as BaseTabs } from '@base-ui-components/react'
import { twMerge } from 'tailwind-merge'
import type { ReactNode } from 'react'

export function Tab({
  icon,
  title,
  className,
  description,
  ...props
}: Omit<BaseTabs.Tab.Props, 'title'> & {
  icon?: ReactNode
  title: ReactNode
  description?: string
  className?: string
}) {
  return (
    <BaseTabs.Tab
      className={twMerge(
        'flex flex-col items-start gap-1 px-4 py-3 shadow-sm',
        className,
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>
        {icon}
        {title}
      </div>
      {description && (
        <span className='text-sm text-text-secondary whitespace-nowrap'>
          {description}
        </span>
      )}
    </BaseTabs.Tab>
  )
}

export const Root = BaseTabs.Root
export const List = BaseTabs.List
export const Panel = BaseTabs.Panel
