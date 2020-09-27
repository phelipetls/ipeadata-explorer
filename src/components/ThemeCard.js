import React from "react";

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

export default function ThemeCard({ themeName, children }) {
  const classes = useStyles();

  return (
    <Paper
      component={RouterLink}
      to={`/series?TEMNOME=${themeName}`}
      variant="outlined"
      className={classes.container}
    >
      <div className={classes.content}>{children}</div>
    </Paper>
  );
}
