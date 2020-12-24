import React from "react";
import { Select } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  isLoading: boolean;
  date: string;
  dates: string[];
  handleChange(e: any): void;
}

export function SelectDate({ isLoading, date, dates, handleChange }: Props) {
  const classes = useStyles();

  if (isLoading) return null;

  return (
    <div className={classes.root}>
      <Select
        native
        variant="outlined"
        label="Período"
        value={date}
        onChange={handleChange}
      >
        {dates.map(date => (
          <option key={date}>{date}</option>
        ))}
      </Select>
    </div>
  );
}
