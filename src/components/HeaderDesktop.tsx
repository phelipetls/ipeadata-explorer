import { SearchBox } from './SearchBox'
import { Heading } from './Heading'
import { Link } from 'react-router'
import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useRef, useState } from 'react'

type Props = React.ComponentPropsWithoutRef<'header'>

const ANIMATION_DURATION = 150

export function HeaderDesktop({ className, style, ...rest }: Props) {
  const [open, setOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const didDelayPopupOpen = useRef(false)

  return (
    <div
      style={
        {
          '--animation-duration': ANIMATION_DURATION + 'ms',
          ...style,
        } as React.CSSProperties
      }
      className={clsx(
        'grid py-2 items-center',
        isFocused ? 'grid-cols-[1fr_1fr]' : 'grid-cols-[2fr_1fr]',
        'transition-all duration-(--animation-duration) ease-in-out',
        className,
      )}
      onTransitionEnd={() => {
        if (didDelayPopupOpen.current) {
          setOpen(true)
          didDelayPopupOpen.current = false
        }
      }}
      onTransitionCancel={() => {
        didDelayPopupOpen.current = false
      }}
      {...rest}
    >
      <div>
        <Link to='/'>
          <Heading className='inline text-2xl min-w-0 whitespace-nowrap' />
        </Link>
      </div>

      <SearchBox
        open={open}
        onOpenChange={(open, details) => {
          if (details.reason === 'trigger-press' && open === true) {
            didDelayPopupOpen.current = true
            return
          }
          setOpen(open)
        }}
        renderBox={<div className='' />}
        renderInput={
          <input
            className={'field-sizing-content'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        }
        renderEndIcon={
          <button className='pointer-events-none'>
            <Search size={16} />
          </button>
        }
      />
    </div>
  )
}
