import { Link } from '@material-ui/core'
import * as React from 'react'

interface ReadMoreProps {
  isTruncated: boolean
  onClick: () => void
}

export function ReadMore({ isTruncated, onClick }: ReadMoreProps) {
  return (
    <>
      {isTruncated && <span>...</span>}{' '}
      <Link href='#' onClick={onClick}>
        {isTruncated ? 'Ler mais »' : '« Ler menos'}
      </Link>
    </>
  )
}
