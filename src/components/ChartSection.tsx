import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6),
  },
}));

interface Props {
  children: JSX.Element[];
}

export function ChartSection({ children }: Props) {
  const classes = useStyles();

  return <Paper className={classes.root}>{children}</Paper>;
}
