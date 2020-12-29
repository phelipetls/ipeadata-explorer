import * as React from "react";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  content: {
    padding: "1em 0.5em",
  },
}));

interface Props {
  themeName: string;
  children: Array<JSX.Element | null>;
}

export function ThemeCard({ themeName, children }: Props) {
  const classes = useStyles();

  return (
    <RouterLink to={`/series?TEMNOME=${themeName}`}>
      <Paper variant="outlined" className={classes.container}>
        <div className={classes.content}>{children}</div>
      </Paper>
    </RouterLink>
  );
}
