import React from "react";

import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Hidden,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import NavigationBarMenu from "./NavigationBarMenu";

const useStyles = makeStyles(theme => ({
  toolbar: {
    height: "4em",
    justifyContent: "space-between"
  },
  link: {
    "&:not(:last-child)": {
      marginRight: "1.5em",
    },
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
      filter: "brightness(130%)",
    }
  },
}));

export default function NavigationBar() {
  const classes = useStyles();
  const links = [
    <Link key={1} className={classes.link}>Temas</Link>,
    <Link key={2} className={classes.link}>Países</Link>,
    <Link key={3} className={classes.link}>Níveis Geográficos</Link>
  ];

  return (
    <AppBar color="transparent" position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" color="primary">
          IPEA
        </Typography>
        <Hidden xsDown>
          <nav className={classes.nav}>{links}</nav>
        </Hidden>
        <Hidden smUp>
          <NavigationBarMenu links={links} />
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
