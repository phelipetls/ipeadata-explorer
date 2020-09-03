import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Hidden,
  Menu,
  MenuItem,
  IconButton
} from "@material-ui/core";

import { MoreVert } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  toolbar: {
    height: "4em",
    justifyContent: "space-between"
  },
  link: {
    margin: "1em",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
      filter: "brightness(130%)",
    }
  },
}));

export default function NavigationBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const useMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const useMenuClose = () => {
    setAnchorEl(null);
  };

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
          <IconButton onClick={useMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClick={useMenuClose}>
            {links.map((link, index) => {
              return <MenuItem key={index}>{link}</MenuItem>;
            })}
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
