import React from "react";

import { Link, List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  navigationList: {
    display: "flex",
    flexDirection: "row",
  },
  navigationListItem: {
    cursor: "pointer",
    textAlign: "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export function NavigationBarList(props) {
  const classes = useStyles();

  return (
    <List className={classes.navigationList}>
      {props.links.map((link, index) => (
        <ListItem
          to={link.url}
          component={RouterLink}
          key={index}
          className={classes.navigationListItem}
        >
          <Link component="div" underline="none">
            {link.text}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
