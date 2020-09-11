import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  canvasContainer: {
    position: "relative",
    minHeight: 512,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }
}));

export default function ChartSection({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.canvasContainer}>
      {children}
    </div>
  );
}
