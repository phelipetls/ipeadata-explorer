import React, { useState } from "react";

import { MoreVert } from "@material-ui/icons";
import { Menu, MenuItem, IconButton, Link } from "@material-ui/core";

import { Link as RouterLink } from "react-router-dom";

export default function NavigationBarMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const useMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const useMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton style={{ alignSelf: "center" }} onClick={useMenuOpen}>
        <MoreVert />
      </IconButton>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClick={useMenuClose}>
        {props.links.map(({ text, url }, index) => {
          return (
            <MenuItem key={index}>
              <Link to={url} component={RouterLink}>
                {text}
              </Link>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
