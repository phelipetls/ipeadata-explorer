import * as React from "react";

import { Grid, GridProps, CircularProgress } from "@material-ui/core";

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
