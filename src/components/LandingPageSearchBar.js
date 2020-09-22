import React from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  searchContainer: {
    textAlign: "center"
  },
  search: {
    width: "73vw"
  }
}));

export default function LandingPageSearchBar() {
  const classes = useStyles();

  return (
    <div className={classes.searchContainer}>
      <TextField
        className={classes.search}
        placeholder="Pesquise por palavras"
        variant="outlined"
      />
    </div>
  );
}
