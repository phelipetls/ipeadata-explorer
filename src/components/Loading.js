import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function Loading(props) {
  const classes = useStyles();

  return (
    <div className={classes.center}>
      <CircularProgress />
    </div>
  );
}
