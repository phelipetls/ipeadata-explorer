import React from "react";

import { Grid } from "@material-ui/core";

export default function Center({ style, children }) {
  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      justify="center"
      style={style}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <Grid key={index} item>
              {child}
            </Grid>
          ))
        : children}
    </Grid>
  );
}
