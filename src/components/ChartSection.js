import React from "react";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: {
    margin: "2em 0",
    padding: "2em",
  },
}));

export default function ChartSection({ children }) {
  const classes = useStyles();
  return <Paper className={classes.container}>{children}</Paper>;
}
