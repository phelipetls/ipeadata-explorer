import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
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
  link: {
    textDecoration: "none",
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
    <Paper variant="outlined" className={classes.container}>
      <RouterLink to={`/series?TEMNOME=${themeName}`} className={classes.link}>
        <div className={classes.content}>{children}</div>
      </RouterLink>
    </Paper>
  );
}
