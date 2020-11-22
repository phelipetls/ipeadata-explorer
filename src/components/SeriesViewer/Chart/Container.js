import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.chart.height,
  },
}));

export function Container(props) {
  const classes = useStyles();

  const { children, ...rest } = props;

  return (
    <div className={classes.root} {...rest} data-testid="chart-container">
      {children}
    </div>
  );
}
