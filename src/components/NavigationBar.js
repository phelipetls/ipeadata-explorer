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

import NavigationBarMenu from "./NavigationBarMenu";
import SearchButton from "./SearchButton";
import BackButton from "./BackButton";

const useStyles = makeStyles(theme => ({
  appBar: {
    height: "4em",
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
            InputProps={{ disableUnderline: true, startAdornment: <BackButton onClick={handleBlur} /> }}
          />
        </div>
      ) : (
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" color="primary">
            IPEA
          </Typography>
          <Toolbar disableGutters>
            <Hidden xsDown>
              <List className={classes.navigationList}>
                {links.map(link => (
                  <ListItem className={classes.navigationListItem}>
                    {link}
                  </ListItem>
                ))}
              </List>
            </Hidden>
            <SearchButton onClick={handleClick} />
            <Hidden smUp>
              <NavigationBarMenu links={links} />
            </Hidden>
          </Toolbar>
        </Toolbar>
      )}
    </AppBar>
  );
}
