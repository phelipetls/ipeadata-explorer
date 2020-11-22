import React from "react";

import { TextField } from "@material-ui/core";
import { Event } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import { StyledKeyboardDatePicker } from "../../common/StyledKeyboardDatePicker";

const useStyles = makeStyles(theme => ({
  datePicker: {
    [theme.breakpoints.up("md")]: {
      minWidth: "19ch",
    },
  },
}));

const dateViewsByPeriodicity = {
  Mensal: ["year", "month"],
  Trimestral: ["year", "month"],
  Semestral: ["year", "month"],
  Anual: ["year"],
  Decenal: ["year"],
  Quadrienal: ["year"],
  Quinquenal: ["year"],
};

export function DateInputs({ metadata }) {
  const classes = useStyles();

  const resetDate = date => {
    if (!date) return;

    if (metadata.PERNOME !== "Diária") {
      date.setDate(1);
    }

    if (metadata.PERNOME !== "Mensal") {
      date.setMonth(0);
    }
  };

  const minDate = new Date(metadata.SERMINDATA);
  const maxDate = new Date(metadata.SERMAXDATA);

  return (
    <>
      <StyledKeyboardDatePicker
        name="initialDate"
        id="initial-date"
        label="Data inicial"
        minDate={minDate}
        maxDate={maxDate}
        initialFocusedDate={maxDate}
        onAccept={resetDate}
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        keyboardIcon={<Event fontSize="small" />}
        className={classes.datePicker}
      />

      <StyledKeyboardDatePicker
        name="finalDate"
        id="end-date"
        label="Data final"
        minDate={minDate}
        maxDate={maxDate}
        initialFocusedDate={maxDate}
        onAccept={resetDate}
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        keyboardIcon={<Event fontSize="small" />}
        className={classes.datePicker}
      />

      <TextField
        type="number"
        name="lastN"
        id="last-n"
        variant="outlined"
        label="Últimos N"
      />
    </>
  );
}
