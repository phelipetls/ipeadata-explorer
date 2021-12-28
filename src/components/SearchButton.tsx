import { IconButton } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import * as React from 'react'

interface Props {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function SearchButton({ onClick, ...rest }: Props) {
  const handleClick = () => typeof onClick === 'function' && onClick()

  return (
    <IconButton
      color='default'
      onClick={handleClick}
      style={{ alignSelf: 'center' }}
      type='button'
      data-testid='search-button'
      aria-label='Pesquisar'
      {...rest}
    >
      <Search />
    </IconButton>
  )
}
