import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
    flex: 1,
    fontSize: "0.7rem",
  },
});

interface Props {
  name: string,
}

export function ThemeName(props: Props) {
  const classes = useStyles();

  return (
    <Typography align="center" color="textPrimary" className={classes.title}>
      {props.name}
    </Typography>
  );
}
