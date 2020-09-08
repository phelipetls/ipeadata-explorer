import React from "react";

import {
  Grid,
  Typography,
  Paper,
  Collapse,
  IconButton
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import SeriesForm from "./SeriesForm";

const useStyles = makeStyles(theme => ({
  filterContainer: {
    maxWidth: theme.breakpoints.values.md,
    padding: theme.spacing(2),
    margin: "2em auto"
  },
  collapsed: {
    marginTop: theme.spacing(2)
  }
}));

export default function SeriesFilter(props) {
  const classes = useStyles();
  const { onSubmit, formOpen, setFormOpen } = props;

  return (
    <Paper className={classes.filterContainer}>
      <Grid container>
        <Typography variant="h6">Filtros</Typography>

        <IconButton
          aria-label="Expande filtros"
          size="small"
          onClick={() => setFormOpen(!formOpen)}
        >
          {formOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Grid>

      <Collapse in={formOpen}>
        <SeriesForm onSubmit={onSubmit} />
      </Collapse>
    </Paper>
  );
}