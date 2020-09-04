import React from "react";

import {
  Card,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  card: {
    textDecoration: "none",
  },
  cardContent: {
    padding: "1em 0.5em",
  },
}));

export default function ThemeCard(props) {
  const classes = useStyles();

  return (
    <Card
      component={RouterLink}
      to=""
      variant="outlined"
      className={classes.card}
      key={props.code}
    >
      <CardContent className={classes.cardContent}>
        {props.children}
      </CardContent>
    </Card>
  );
}
