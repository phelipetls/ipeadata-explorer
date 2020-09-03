import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Hidden,
  List,
  ListItem,
  IconButton,
  TextField
} from "@material-ui/core";

import { Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import NavigationBarMenu from "./NavigationBarMenu";

const useStyles = makeStyles(theme => ({
  appBar: {
    height: "4em"
  },
  toolbar: {
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
    padding: "0 1em",
  }
}));

export default function NavigationBar() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const useSearch = () => setIsSearching(true);
  const useToolbar = () => setIsSearching(false);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.target.value = "";
      e.target.blur();
    }
  }

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
            onKeyDown={handleKeyDown}
            onBlur={useToolbar}
            placeholder="Pesquisar..."
            type="search"
            autoFocus
            fullWidth
            InputProps={{ disableUnderline: true }}
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
            <IconButton color="default" onClick={useSearch}>
              <Search />
            </IconButton>
            <Hidden smUp>
              <NavigationBarMenu links={links} />
            </Hidden>
          </Toolbar>
        </Toolbar>
      )}
    </AppBar>
  );
}
