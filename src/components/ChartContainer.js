import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { Loading } from "./Loading";
import { NoData } from "./NoData";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: theme.chart.minHeight,
    marginTop: theme.spacing(3),
  },
}));

export function ChartContainer({ isLoading, data, children }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {isLoading ? (
        <Loading />
      ) : data.length === 0 ? (
        <NoData text="Sem dados" />
      ) : (
        children
      )}
    </div>
  );
}
