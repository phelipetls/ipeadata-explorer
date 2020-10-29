import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  canvasContainer: {
    position: "relative",
    minHeight: theme.chart.minHeight,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export function ChartContainer({ children }) {
  const classes = useStyles();
  return <div className={classes.canvasContainer}>{children}</div>;
}
