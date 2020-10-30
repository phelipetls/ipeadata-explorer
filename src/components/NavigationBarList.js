import React from "react";

import { Link, List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(() => ({
  link: {
    "&:not(:last-child)": {
      marginRight: "1.5em",
    },
  },
  navigationList: {
    display: "flex",
    flexDirection: "row",
  },
  navigationListItem: {
    cursor: "pointer",
    "&": {},
    justifyContent: "center",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
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
          <Link component="div" className={classes.link} underline="none">
            {link.text}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
