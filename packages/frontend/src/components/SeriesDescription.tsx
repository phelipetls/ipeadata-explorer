import DOMPurify from 'dompurify'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from './Button'
import clsx from 'clsx'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  children: ReactNode
}

export function SeriesDescription({ children, className, ...rest }: Props) {
  const [isClamped, setIsClamped] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const paragraphRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!paragraphRef.current) {
      return
    }

    const tabbableElems = paragraphRef.current.querySelectorAll('a')
    for (const elem of tabbableElems) {
      elem.tabIndex = isExpanded ? 0 : -1
    }
  }, [isExpanded])

  useEffect(() => {
    if (!paragraphRef.current) return
    const node = paragraphRef.current
    setIsClamped(node.clientHeight < node.scrollHeight)
  }, [])

  return (
    <div className={clsx('relative leading-relaxed', className)} {...rest}>
      {typeof children === 'string' ? (
        <p
          ref={paragraphRef}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(children) }}
          className={!isExpanded ? 'line-clamp-5' : ''}
        />
      ) : (
        children
      )}

      {isClamped && (
        <div
          className={clsx(
            !isExpanded
              ? 'absolute bottom-0 left-0 right-0 w-full h-[2lh] grid grid-rows-[1lh_1lh]'
              : 'mt-2',
          )}
        >
          {!isExpanded && (
            <div className='bg-linear-to-b from-transparent to-surface-primary/100' />
          )}

          <div className='bg-surface-primary'>
            <Button
              variant='text'
              size='medium'
              onClick={() => setIsExpanded(!isExpanded)}
              className='w-full'
            >
              {isExpanded ? 'Ver menos' : 'Ver mais'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
