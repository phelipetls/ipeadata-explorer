import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  subtitle: {
    fontSize: "0.6rem",
  },
}));

export function ThemeParent(props) {
  const classes = useStyles();

  return (
    <Typography
      variant="subtitle1"
      align="center"
      color="textSecondary"
      className={classes.subtitle}
    >
      {props.name}
    </Typography>
  );
}
