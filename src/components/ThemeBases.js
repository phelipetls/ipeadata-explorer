import React from "react";

import { colors } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  row: {
    padding: "1em",
    display: "flex",
    "& > *:first-child": {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius
    },
    "& > *:last-child": {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    }
  },
  column: {
    flex: "1 0",
    height: "1vh"
  }
}));

export default function ThemeBases(props) {
  const classes = useStyles();

  const { macro, regional, social } = props;

  return (
    <div className={classes.row}>
      {macro && (
        <div
          className={classes.column}
          style={{ backgroundColor: colors.blue[600] }}
        />
      )}
      {regional && (
        <div
          className={classes.column}
          style={{ backgroundColor: colors.green[600] }}
        />
      )}
      {social && (
        <div
          className={classes.column}
          style={{ backgroundColor: colors.red[600] }}
        />
      )}
    </div>
  );
}
