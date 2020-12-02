import React from "react";

import { Paper, IconButton, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { GitHub } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  footer: {
    textAlign: "center",
  },
  icon: {
    color: theme.palette.text.primary,
  },
}));

export function Footer() {
  const classes = useStyles();

  return (
    <Paper square elevation={3} component="footer" className={classes.footer}>
      <IconButton
        component={Link}
        href="https://github.com/phelipetls/ipeadata-explorer"
        className={classes.icon}
      >
        <GitHub />
      </IconButton>
    </Paper>
  );
}