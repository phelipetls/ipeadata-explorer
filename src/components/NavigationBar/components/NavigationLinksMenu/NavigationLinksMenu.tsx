import { IconButton, Link, Menu, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { NavigationLink } from "../../types";

interface Props {
  links: NavigationLink[];
}

export function NavigationLinksMenu({ links }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClick = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        style={{ alignSelf: "center" }}
        onClick={handleIconClick}
        aria-label="Mais opções de navegação"
      >
        <MoreVert />
      </IconButton>

      <Menu
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClick={handleMenuClick}
      >
        {links.map(({ text, url }, index) => (
          <MenuItem key={index}>
            <Link component={RouterLink} to={url} underline="none">
              {text}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
