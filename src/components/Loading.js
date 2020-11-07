import React from "react";

import { Grid, CircularProgress } from "@material-ui/core";

export function Loading(props) {
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
