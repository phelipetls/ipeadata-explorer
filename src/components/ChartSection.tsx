import * as React from "react";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    margin: `${theme.spacing(3)}px 0`,
    padding: theme.spacing(3),
  },
}));

interface Props {
  children: JSX.Element[];
}

export function ChartSection({ children }: Props) {
  const classes = useStyles();

  return <Paper className={classes.root}>{children}</Paper>;
}
