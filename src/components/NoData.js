import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";

export default function NoData({ style }) {
  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justify="center"
      style={style}
    >
      <Error fontSize="large" />
      <Typography variant="h6">Sem dados</Typography>
    </Grid>
  );
}
