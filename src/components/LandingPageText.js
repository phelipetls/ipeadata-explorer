import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  landingPageText: {
    margin: "0 auto",
    maxWidth: "73vw",
    height: "20vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function Description() {
  const classes = useStyles();

  return (
    <Typography variant="h4" align="center" className={classes.landingPageText}>
      Explore a base de dados do Ipeadata
    </Typography>
  );
}
