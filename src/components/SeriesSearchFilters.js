import React from "react";

import {
  Grid,
  Typography,
  Paper,
  Collapse,
  IconButton,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { SeriesForm } from "./SeriesForm";

const useStyles = makeStyles(theme => ({
  filterContainer: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  arrow: {
    marginLeft: theme.spacing(1),
  },
}));

export function SeriesSearchFilters(props) {
  const classes = useStyles();
  const { searchParams, onSubmit, formOpen, setFormOpen } = props;

  return (
    <Paper className={classes.filterContainer}>
      <Grid container>
        <Typography variant="h6">Filtros</Typography>

        <IconButton
          aria-label="Expande filtros"
          size="small"
          onClick={() => setFormOpen(!formOpen)}
          className={classes.arrow}
        >
          {formOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Grid>

      <Collapse in={formOpen}>
        <SeriesForm searchParams={searchParams} onSubmit={onSubmit} />
      </Collapse>
    </Paper>
  );
}
