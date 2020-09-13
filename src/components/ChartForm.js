import React from "react";

import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
    display: "flex",
    flexFlow: "column",
    [theme.breakpoints.up("md")]: {
      flexFlow: "row"
    },
    "& > *": {
      margin: theme.spacing(1)
    }
  }
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
