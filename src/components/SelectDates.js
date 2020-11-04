import React from "react";
import { Select } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  selectDates: {
    marginTop: theme.spacing(3),
  },
}));

export function SelectDates({ date, dates, handleChange }) {
  const classes = useStyles();

  return (
    <Select
      native
      variant="outlined"
      label="Período"
      value={date}
      onChange={handleChange}
      className={classes.selectDates}
    >
      {dates.map(date => (
        <option key={date}>{date}</option>
      ))}
    </Select>
  );
}
