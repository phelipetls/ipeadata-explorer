import type { ReactNode } from 'react'
import { Tabs as BaseTabs } from '@base-ui-components/react'
import clsx from 'clsx'

function Root(props: BaseTabs.Root.Props) {
  return <BaseTabs.Root {...props} />
}

function List({ children, className, ...rest }: BaseTabs.List.Props) {
  return (
    <div className={clsx('full-bleed grid-app', className)}>
      <div className='border-b-2 border-b-outline full-bleed row-1' />

      <BaseTabs.List className={'flex flex-row row-1'} {...rest}>
        {children}
      </BaseTabs.List>
    </div>
  )
}

function Tab({
  icon,
  children,
  isSelected,
  ...props
}: BaseTabs.Tab.Props & {
  icon: ReactNode
  children: ReactNode
  isSelected: boolean
}) {
  return (
    <BaseTabs.Tab
      {...(isSelected && { 'data-selected': '' })}
      className={clsx(
        'appearance-none',
        'text-base',
        'text-text-secondary',
        'rounded-t-lg',
        'border-b-2',
        'border-outline',
        'px-4 py-2',
        'flex flex-row gap-1 items-center',
        'bg-tab',
        'hover:bg-tab-hover',
        'font-bold',
        'active:bg-tab-active',
        'data-selected:bg-tab-selected',
        'data-selected:hover:bg-tab-selected-hover',
        'data-selected:active:bg-tab-selected-active',
        'data-selected:text-text-primary',
        'data-selected:border-accent',
        'transition-colors',
        'duration-150',
        'ease-in',
        props.className,
      )}
      {...props}
    >
      {icon}
      {children}
    </BaseTabs.Tab>
  )
}

function Panel({ className, ...rest }: BaseTabs.Panel.Props) {
  return (
    <BaseTabs.Panel
      className={clsx('full-bleed grid-app', className)}
      {...rest}
    />
  )
}

export const Tabs = {
  Root,
  List,
  Tab,
  Panel,
}
