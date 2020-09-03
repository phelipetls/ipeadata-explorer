import React, { useState } from "react";

import { MoreVert } from "@material-ui/icons";
import { Menu, MenuItem, IconButton } from "@material-ui/core";

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
      <IconButton onClick={useMenuOpen}>
        <MoreVert />
      </IconButton>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClick={useMenuClose}>
        {props.links.map((link, index) => {
          return <MenuItem key={index}>{link}</MenuItem>;
        })}
      </Menu>
    </>
  );
}
