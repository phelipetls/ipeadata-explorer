import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.chart.height,
  },
}));

interface Props {
  children: JSX.Element | JSX.Element[];
}

export function ChartContainer(props: Props) {
  const classes = useStyles();

  const { children, ...rest } = props;

  return (
    <div className={classes.root} {...rest} data-testid="chart-container">
      {children}
    </div>
  );
}
