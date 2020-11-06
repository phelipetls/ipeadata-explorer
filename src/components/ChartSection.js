import React from "react";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    margin: `${theme.spacing(3)}px 0`,
    padding: theme.spacing(3),
  },
}));

export function ChartSection({ children }) {
  const classes = useStyles();

  return <Paper className={classes.container}>{children}</Paper>;
}
