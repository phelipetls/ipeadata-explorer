import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.chart.height,
  },
}));

export function ChartContainer(props) {
  const classes = useStyles();

  const { children, ...rest } = props;

  return (
    <div className={classes.root} {...rest}>
      {children}
    </div>
  );
}
