import { SearchBox } from './SearchBox'
import { Heading } from './Heading'
import { Link } from 'react-router'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'

type Props = React.ComponentPropsWithoutRef<'header'>

export function HeaderMobile({ className, ...rest }: Props) {
  const [isInputFocused, setIsFocused] = useState(false)

  const boxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hideBox = () => {
    boxRef.current?.classList.add('opacity-0')
    boxRef.current?.classList.add('pointer-events-none')
  }

  const showBox = () => {
    boxRef.current?.classList.remove('opacity-0')
    boxRef.current?.classList.remove('pointer-events-none')
  }

  return (
    <div
      className={clsx(
        'grid items-center justify-between py-2',
        'sm:grid-cols-[auto_480px]',
        isInputFocused
          ? 'grid-cols-[auto_auto]'
          : 'grid-cols-[min-content_48px]',
        className,
      )}
      {...rest}
    >
      <Link
        to='/'
        className={clsx(
          'row-1 col-1',
          isInputFocused && 'invisible',
          'sm:visible',
        )}
      >
        <Heading className='text-2xl min-w-0 whitespace-nowrap' />
      </Link>

      <SearchBox
        renderBox={
          <div
            ref={(node) => {
              boxRef.current = node
            }}
            className={clsx(
              'row-1 col-span-full sm:col-2',
              'opacity-0',
              'pointer-events-none',
              'sm:opacity-100',
              'sm:pointer-events-auto',
            )}
          />
        }
        renderInput={
          <input
            ref={inputRef}
            onFocus={() => {
              setIsFocused(true)
            }}
            onBlur={() => {
              setIsFocused(false)
              hideBox()
            }}
          />
        }
        renderStartIcon={
          <button className='' onClick={() => inputRef.current?.blur()}>
            <ArrowLeft size={24} />
          </button>
        }
        renderTriggerButton={
          <button
            className={clsx(
              'sm:hidden',
              'row-1 col-2',
              'inline-flex items-center justify-center',
              'opacity-100',
              isInputFocused && 'opacity-0',
            )}
            onClick={() => {
              showBox()
              inputRef.current?.focus()
            }}
          >
            <Search size={24} />
          </button>
        }
      />
    </div>
  )
}
