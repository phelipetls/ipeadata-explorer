import React from "react";

import { TextField } from "@material-ui/core";
import { Event } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { DatePickerView } from "@material-ui/pickers";

import { useFormContext } from "react-hook-form";

import { HfKeyboardDatePicker } from "components/common";
import { SeriesMetadata } from "components/types";

const useStyles = makeStyles(theme => ({
  datePicker: {
    [theme.breakpoints.up("md")]: {
      minWidth: "19ch",
    },
  },
}));

const dateViewsByPeriodicity: Record<string, DatePickerView[]> = {
  Mensal: ["year", "month"],
  Trimestral: ["year", "month"],
  Semestral: ["year", "month"],
  Anual: ["year"],
  Decenal: ["year"],
  Quadrienal: ["year"],
  Quinquenal: ["year"],
};

export interface ChartDateInputsData {
  startDate: Date,
  endDate: Date,
  lastN: number,
}

interface Props {
  metadata: SeriesMetadata;
}

export function ChartDateInputs({ metadata }: Props) {
  const classes = useStyles();

  const { register, control } = useFormContext<ChartDateInputsData>();

  const resetDate = (date: Date) => {
    if (!date) return;

    if (metadata.PERNOME !== "Diária") {
      date.setDate(1);
    }

    if (metadata.PERNOME !== "Mensal") {
      date.setMonth(0);
    }
  };

  const minDate = new Date(metadata.SERMINDATA || 0);
  const maxDate = new Date(metadata.SERMAXDATA || Date.now());

  return (
    <>
      <HfKeyboardDatePicker
        control={control}
        name="startDate"
        id="start-date"
        label="Data inicial"
        minDate={minDate}
        maxDate={maxDate}
        initialFocusedDate={maxDate}
        // FIXME: improve type
        onAccept={resetDate as any}
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        keyboardIcon={<Event fontSize="small" />}
        className={classes.datePicker}
      />

      <HfKeyboardDatePicker
        control={control}
        name="endDate"
        id="end-date"
        label="Data final"
        minDate={minDate}
        maxDate={maxDate}
        initialFocusedDate={maxDate}
        // FIXME: improve type
        onAccept={resetDate as any}
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        keyboardIcon={<Event fontSize="small" />}
        className={classes.datePicker}
      />

      <TextField
        inputRef={register}
        type="number"
        name="lastN"
        id="last-n"
        variant="outlined"
        label="Últimos N"
      />
    </>
  );
}
