import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Hidden,
  List,
  ListItem,
  TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

import NavigationBarMenu from "./NavigationBarMenu";
import SearchButton from "./SearchButton";
import BackButton from "./BackButton";

const useStyles = makeStyles(theme => ({
  appBar: {
    height: "4em"
  },
  toolbar: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  link: {
    "&:not(:last-child)": {
      marginRight: "1.5em"
    },
    "&:hover": {
      textDecoration: "none"
    }
  },
  navigationList: {
    display: "flex",
    flexDirection: "row"
  },
  navigationListItem: {
    cursor: "pointer",
    "&": {},
    justifyContent: "center",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)"
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
  const [searchInput, setSearchInput] = useState("");

  const handleClick = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);

  const handleChange = e => {
    setSearchInput(e.target.value);
  };

  const handleEscape = e => {
    if (e.key === "Escape") {
      e.target.value = "";
      e.target.blur();
    }
  };

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
      className={classes.appBar}
    >
      {isSearching ? (
        <div className={classes.searchContainer}>
          <TextField
            value={searchInput}
            onChange={handleChange}
            className={classes.search}
            onKeyDown={handleEscape}
            onBlur={handleBlur}
            placeholder="Pesquisar..."
            type="search"
            autoFocus
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: <BackButton onClick={handleBlur} />
            }}
          />
        </div>
      ) : (
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" color="primary">
            <Link component={RouterLink} to="/" className={classes.link}>
              IPEA
            </Link>
          </Typography>
          <Toolbar disableGutters>
            <Hidden xsDown>
              <List className={classes.navigationList}>
                {navigationBarLinks.map(({ text, url }, index) => (
                  <ListItem className={classes.navigationListItem} key={index}>
                    <Link to={url} component={RouterLink} className={classes.link}>
                      {text}
                    </Link>
                  </ListItem>
                ))}
              </List>
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
