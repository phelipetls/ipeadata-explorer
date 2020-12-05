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

import { Form } from "./Form";
import { SeriesMetadata } from "../types";

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

interface Props {
  searchParams: URLSearchParams;
  handleSubmit: (data: SeriesMetadata) => void;
  filterActive: boolean;
  setFilterActive: (state: boolean) => void;
}

export function Filters(props: Props) {
  const classes = useStyles();

  const { searchParams, handleSubmit, filterActive, setFilterActive } = props;

  return (
    <Paper className={classes.filterContainer}>
      <Grid container>
        <Typography variant="h6">Filtros</Typography>

        <IconButton
          aria-label="Expande filtros"
          size="small"
          onClick={() => setFilterActive(!filterActive)}
          className={classes.arrow}
        >
          {filterActive ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Grid>

      <Collapse in={filterActive}>
        <Form searchParams={searchParams} onSubmit={handleSubmit} />
      </Collapse>
    </Paper>
  );
}
