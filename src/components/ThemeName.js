import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  title: {
    flex: 1,
    fontSize: "0.7rem",
  },
}));

export default function ThemeName(props) {
  const classes = useStyles();

  return (
    <Typography align="center" color="textPrimary" className={classes.title}>
      {props.name}
    </Typography>
  );
}
