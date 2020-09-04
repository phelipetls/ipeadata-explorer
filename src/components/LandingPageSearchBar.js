import React from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  search: {
    width: "73vw",
  },
}));

export default function LandingPageSearchBar() {
  const classes = useStyles();

  return (
    <TextField
      className={classes.search}
      placeholder="Pesquise por palavras"
      variant="outlined"
    />
  );
}
