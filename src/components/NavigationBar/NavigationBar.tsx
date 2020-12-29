import * as React from "react";

import { AppBar, Toolbar, Link, Typography, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

import { NavigationLink } from "./types";
import { SearchButton } from "components";
import {
  NavigationLinksMenu,
  NavigationLinksList,
  SearchBar,
} from "./components";

const useStyles = makeStyles(() => ({
  appBar: {
    height: "4em",
  },
  mainToolbar: {
    height: "100%",
    justifyContent: "space-between",
  },
  secondaryToolbar: {
    alignItems: "stretch",
  },
}));

const navigationBarLinks: NavigationLink[] = [
  { text: "Séries", url: "/series" },
  { text: "Temas", url: "/temas" },
  { text: "Países", url: "/paises" },
];

export function NavigationBar() {
  const classes = useStyles();

  const [searchActive, setSearchActive] = React.useState(false);

  const activateSearch = () => setSearchActive(true);
  const deactivateSearch = () => setSearchActive(false);

  return (
    <AppBar
      color="transparent"
      position="static"
      component="nav"
      elevation={1}
      className={classes.appBar}
    >
      {searchActive ? (
        <SearchBar deactivateSearch={deactivateSearch} />
      ) : (
        <Toolbar className={classes.mainToolbar}>
          <Typography variant="h5" color="primary" noWrap>
            <Link component={RouterLink} to="/" underline="none">
              Ipeadata Explorer
            </Link>
          </Typography>

          <Toolbar disableGutters className={classes.secondaryToolbar}>
            <Hidden xsDown>
              <NavigationLinksList links={navigationBarLinks} />
            </Hidden>

            <SearchButton onClick={activateSearch} />

            <Hidden smUp>
              <NavigationLinksMenu links={navigationBarLinks} />
            </Hidden>
          </Toolbar>
        </Toolbar>
      )}
    </AppBar>
  );
}
