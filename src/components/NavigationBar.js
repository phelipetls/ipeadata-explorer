import React from "react";

import { AppBar, Toolbar, Link, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "space-between"
  },
  link: {
    margin: "1em",
  }
}))

export default function NavigationBar() {
  const classes = useStyles();

  return (
    <AppBar color="transparent">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" color="primary">
          IPEA
        </Typography>
        <nav>
          <Link className={classes.link}>Temas</Link>
          <Link className={classes.link}>Países</Link>
          <Link className={classes.link}>Níveis Geográficos</Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
}
