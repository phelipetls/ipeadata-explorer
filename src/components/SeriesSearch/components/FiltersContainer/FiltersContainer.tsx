import * as React from "react";

import {
  Grid,
  Typography,
  Paper,
  Collapse,
  IconButton,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

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
  filterActive: boolean;
  setFilterActive: (state: boolean) => void;
  children: JSX.Element;
}

export function FiltersContainer(props: Props) {
  const classes = useStyles();

  const { filterActive, setFilterActive, children } = props;

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

      <Collapse in={filterActive}>{children}</Collapse>
    </Paper>
  );
}
