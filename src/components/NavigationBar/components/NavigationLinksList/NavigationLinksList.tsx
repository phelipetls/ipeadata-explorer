import * as React from "react";

import { Link, List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

import { NavigationLink } from "../../types";

const useStyles = makeStyles(theme => ({
  list: {
    display: "flex",
    flexDirection: "row",
  },
  item: {
    cursor: "pointer",
    textAlign: "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

interface Props {
  links: NavigationLink[];
}

export function NavigationLinksList({ links }: Props) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {links.map((link, index) => (
        <ListItem
          to={link.url}
          component={RouterLink}
          key={index}
          className={classes.item}
        >
          <Link component="div" underline="none">
            {link.text}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
