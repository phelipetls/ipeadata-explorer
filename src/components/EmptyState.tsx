import { Grid, GridProps, Typography } from '@material-ui/core'
import { Error } from '@material-ui/icons'
import * as React from 'react'

interface Props {
  text: string
}

export function EmptyState({ text, ...rest }: Props & GridProps) {
  return (
    <Grid
      container
      spacing={1}
      direction='column'
      wrap='nowrap'
      alignItems='center'
      justify='center'
      style={{ height: '100%' }}
      {...rest}
    >
      <Error fontSize='large' />
      <Typography variant='h6'>{text}</Typography>
    </Grid>
  )
}
