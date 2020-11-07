import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";

export function NoData({ text, ...props }) {
  return (
    <Grid
      container
      spacing={1}
      direction="column"
      wrap="nowrap"
      alignItems="center"
      justify="center"
      {...props}
    >
      <Error fontSize="large" />
      <Typography variant="h6">{text}</Typography>
    </Grid>
  );
}
