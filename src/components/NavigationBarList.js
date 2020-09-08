import React from "react";

import { Link, List, ListItem } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  link: {
    "&:not(:last-child)": {
      marginRight: "1.5em"
    },
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
  }
}));

export default function NavigationBarList(props) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <List className={classes.navigationList}>
      {props.links.map((link, index) => (
        <ListItem
          to={link.url}
          component={RouterLink}
          key={index}
          className={classes.navigationListItem}
        >
          <Link component="div" className={classes.link} style={theme.link}>{link.text}</Link>
        </ListItem>
      ))}
    </List>
  );
}
