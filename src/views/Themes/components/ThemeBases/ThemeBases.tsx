import * as React from "react";

import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  row: {
    padding: "1em",
    display: "flex",
    "& > *:first-child": {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    "& > *:last-child": {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },
  column: {
    flex: "1 0",
    height: "1vh",
  },
}));

interface Props {
  macro: number | null;
  regional: number | null;
  social: number | null;
}

export function ThemeBases(props: Props) {
  const { macro, regional, social } = props;

  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.row}>
      {macro && (
        <div
          className={classes.column}
          style={{ backgroundColor: theme.palette.macro }}
        />
      )}
      {regional && (
        <div
          className={classes.column}
          style={{ backgroundColor: theme.palette.regional }}
        />
      )}
      {social && (
        <div
          className={classes.column}
          style={{ backgroundColor: theme.palette.social }}
        />
      )}
    </div>
  );
}
