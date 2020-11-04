import React from "react";
import { Select } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  selectPeriods: {
    marginTop: theme.spacing(3),
  },
}));

export function SelectPeriods({ period, periods, handleChange }) {
  const classes = useStyles();

  return (
    <Select
      native
      variant="outlined"
      label="Períodos"
      value={period}
      onChange={handleChange}
      className={classes.selectPeriods}
    >
      {periods.map(period => (
        <option key={period}>{period}</option>
      ))}
    </Select>
  );
}
