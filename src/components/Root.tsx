import clsx from 'clsx'
import { Outlet } from 'react-router'
import { HeaderDesktop } from './HeaderDesktop'
import { HeaderMobile } from './HeaderMobile'
import { Footer } from './Footer'

export function Root() {
  return (
    <div
      style={
        {
          '--app-bar-height': 'calc(var(--spacing) * 16)',
        } as React.CSSProperties
      }
      className={clsx(
        'min-h-full',
        'grid-app',
        'grid-rows-[var(--app-bar-height)_auto_1fr_auto]',
      )}
    >
      <div
        className={clsx(
          'full-bleed',
          'grid-app',
          'border-b-1',
          'border-outline',
          'bg-surface-secondary',
        )}
      >
        <HeaderDesktop className='hidden sm:grid' />
        <HeaderMobile className='block sm:hidden' />
      </div>

      <div className='full-bleed grid-app mt-6'>
        <Outlet />
      </div>

      <div />

      <Footer />
    </div>
  )
}
