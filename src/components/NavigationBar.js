import React, { useState } from "react";

import { AppBar, Toolbar, Link, Typography, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

import NavigationBarMenu from "./NavigationBarMenu";
import NavigationBarList from "./NavigationBarList";
import NavigationBarSearch from "./NavigationBarSearch";

import SearchButton from "./SearchButton";

const useStyles = makeStyles(theme => ({
  appBar: {
    height: "4em"
  },
  toolbar: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  // TODO: create theme with link style
  link: {
    "&:not(:last-child)": {
      marginRight: "1.5em"
    },
    "&:hover": {
      textDecoration: "none"
    }
  },
  searchContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  search: {
    padding: "0 1em"
  }
}));

export default function NavigationBar() {
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);

  const navigationBarLinks = [
    { text: "Bases", url: "/bases" },
    { text: "Temas", url: "/temas" },
    { text: "Países", url: "/paises" },
    { text: "Níveis Geográficos", url: "/niveis-geograficos" }
  ];

  const classes = useStyles();

  return (
    <AppBar
      color="transparent"
      position="static"
      component="nav"
      elevation={1}
      className={classes.appBar}
    >
      {isSearching ? (
        <NavigationBarSearch onBlur={handleBlur} />
      ) : (
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" color="primary">
            <Link component={RouterLink} to="/" className={classes.link}>
              IPEA
            </Link>
          </Typography>
          <Toolbar disableGutters>
            <Hidden xsDown>
              <NavigationBarList links={navigationBarLinks} />
            </Hidden>
            <SearchButton onClick={handleClick} />
            <Hidden smUp>
              <NavigationBarMenu links={navigationBarLinks} />
            </Hidden>
          </Toolbar>
        </Toolbar>
      )}
    </AppBar>
  );
}
