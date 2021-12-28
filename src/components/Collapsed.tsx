import { Collapse, IconButton, Paper, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import * as React from 'react'

interface Props {
  label: string
  children: JSX.Element
}

export function Collapsed({ label, children }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <Paper>
      <Typography variant='h5'>
        {label}
        <IconButton size='small' onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Typography>

      <Collapse in={open}>{children}</Collapse>
    </Paper>
  )
}
