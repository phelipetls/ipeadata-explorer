import React from "react";

import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Hidden,
  List,
  ListItem
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
      marginRight: "1.5em"
    },
    "&:hover": {
      textDecoration: "none",
    }
  },
  navigationList: {
    display: "flex",
    flexDirection: "row"
  },
  navigationListItem: {
    cursor: "pointer",
    "&": {
    },
    justifyContent: "center",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    }
  }
}));

export default function NavigationBar() {
  const classes = useStyles();
  const links = [
    <Link key={1} className={classes.link}>
      Temas
    </Link>,
    <Link key={2} className={classes.link}>
      Países
    </Link>,
    <Link key={3} className={classes.link}>
      Níveis Geográficos
    </Link>
  ];

  return (
    <AppBar color="transparent" position="static" component="nav">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" color="primary">
          IPEA
        </Typography>
        <Hidden xsDown>
          <List className={classes.navigationList}>
            {links.map(link => (
              <ListItem className={classes.navigationListItem}>{link}</ListItem>
            ))}
          </List>
        </Hidden>
        <Hidden smUp>
          <NavigationBarMenu links={links} />
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
