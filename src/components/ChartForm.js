import React from "react";

import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexFlow: "column",
    [theme.breakpoints.up("md")]: {
      flexFlow: "row wrap",
    },
    "& > *": {
      margin: theme.spacing(1),
      [theme.breakpoints.up("md")]: {
        flexBasis: "13ch",
        flexGrow: 1,
        flexShrink: 0,
      },
    },
  },
}));

export default function ChartForm(props) {
  const classes = useStyles();

  return (
    <form className={classes.form} onSubmit={props.onSubmit}>
      {props.children}

      <Button type="submit" variant="contained" color="primary">
        Filtrar
      </Button>
    </form>
  );
}
