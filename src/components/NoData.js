import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  text: {
    paddingTop: theme.spacing(1),
  },
}));

export function NoData({ text, style }) {
  const classes = useStyles();

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
      <Typography className={classes.text} variant="h6">
        {text}
      </Typography>
    </Grid>
  );
}
