import { CircularProgress, Grid, GridProps } from "@material-ui/core";
import * as React from "react";

export function Loading(props: GridProps) {
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      style={{ height: "100%" }}
      {...props}
    >
      <CircularProgress />
    </Grid>
  );
}
