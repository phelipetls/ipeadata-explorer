import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(6),
      paddingLeft: theme.spacing(6),
    }
  },
}))

interface Props {
  children: JSX.Element | JSX.Element[]
}

export function SeriesSection({ children }: Props) {
  const classes = useStyles()

  return <Paper className={classes.root}>{children}</Paper>
}
