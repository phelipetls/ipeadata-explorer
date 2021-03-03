import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
}));

interface Props {
  children: JSX.Element | JSX.Element[];
}

export function ChartActions(props: Props) {
  const classes = useStyles();

  const { children } = props;

  return (
    <Grid container justify="flex-end" className={classes.root}>
      {children}
    </Grid>
  );
}
