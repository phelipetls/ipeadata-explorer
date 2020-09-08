import React, { useState } from "react";

import { AppBar, Toolbar, Link, Typography, Hidden } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

import NavigationBarMenu from "./NavigationBarMenu";
import NavigationBarList from "./NavigationBarList";
import NavigationBarSearch from "./NavigationBarSearch";

import SearchButton from "./SearchButton";

const useStyles = makeStyles(theme => ({
  appBar: {
    height: "4em"
  },
  mainToolbar: {
    height: "100%",
    justifyContent: "space-between"
  },
  secondaryToolbar: {
    alignItems: "stretch",
  },
}));

export default function NavigationBar() {
  const theme = useTheme();

  const [isSearching, setIsSearching] = useState(false);

  const handleClick = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);

  const navigationBarLinks = [
    { text: "Séries", url: "/series" },
    { text: "Temas", url: "/temas" },
    { text: "Países", url: "/paises" },
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
        <Toolbar className={classes.mainToolbar}>
          <Typography variant="h5" color="primary">
            <Link component={RouterLink} to="/" style={theme.link}>
              IPEA
            </Link>
          </Typography>

          <Toolbar className={classes.secondaryToolbar} disableGutters>
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
