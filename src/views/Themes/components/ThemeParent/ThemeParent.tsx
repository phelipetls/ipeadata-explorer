import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles({
  subtitle: {
    fontSize: "0.6rem",
  },
});

interface Props {
  name: string;
}

export function ThemeParent({ name }: Props) {
  const classes = useStyles();

  return (
    <Typography
      variant="subtitle1"
      align="center"
      color="textSecondary"
      className={classes.subtitle}
    >
      {name}
    </Typography>
  );
}
