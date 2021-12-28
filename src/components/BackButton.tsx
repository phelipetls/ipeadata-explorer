import { IconButton, IconButtonProps } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import * as React from 'react'

interface Props {
  onClick: () => void
}

export function BackButton({ onClick, ...rest }: Props & IconButtonProps) {
  return (
    <IconButton color='default' onClick={onClick} {...rest}>
      <ArrowBack />
    </IconButton>
  )
}
