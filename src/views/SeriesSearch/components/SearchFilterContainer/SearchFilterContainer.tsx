import {
  Collapse,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import * as React from "react";

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

export function SearchFilterContainer(props: Props) {
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
