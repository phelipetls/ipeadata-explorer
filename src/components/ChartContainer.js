import React from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    marginTop: "2em",
    padding: "2em"
  }
}));

export default function ChartContainer({ children }) {
  const classes = useStyles();

  return (
    <Grid container component={Paper} xs={12} className={classes.container}>
      {children}
    </Grid>
  );
}
