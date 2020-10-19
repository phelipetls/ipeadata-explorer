import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Loading(props) {
  const classes = useStyles();

  return (
    <div className={classes.center} style={{ ...props.style }}>
      <CircularProgress />
    </div>
  );
}
