import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { Loading } from "./Loading";
import { NoData } from "./NoData";

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.chart.height,
    "& > *": {
      height: "100%",
    },
  },
}));

export function ChartContainer({ isLoading, data, children, ...props }) {
  const classes = useStyles();

  if (isLoading) {
    return (
      <div className={classes.root} {...props}>
        <Loading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={classes.root} {...props}>
        <NoData text="Sem dados" />
      </div>
    );
  }

  return children;
}
