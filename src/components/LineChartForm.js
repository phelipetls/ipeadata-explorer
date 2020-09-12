import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
    display: "flex",
    flexFlow: "column",
    [theme.breakpoints.up("md")]: {
      flexFlow: "row"
    },
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

const dateViewsByPeriodicity = {
  Mensal: ["year", "month"],
  Anual: ["year"]
};

export default function LineChartForm({ metadata, onSubmit, children }) {
  const classes = useStyles();

  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState("");

  const setToFirstDay = date =>
    metadata.PERNOME !== "Diária" && date.setDate(1);

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <DatePicker
        name="initialDate"
        label="Data inicial"
        value={initialDate}
        minDate={new Date(metadata.SERMINDATA)}
        onChange={setInitialDate}
        onAccept={setToFirstDay}
        format="dd/MM/yyyy"
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        disabled={Boolean(lastN)}
        inputVariant="outlined"
        clearable
      />

      <DatePicker
        name="finalDate"
        label="Data final"
        value={finalDate}
        maxDate={new Date(metadata.SERMAXDATA)}
        onChange={setFinalDate}
        onAccept={setToFirstDay}
        format="dd/MM/yyyy"
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        inputVariant="outlined"
        disabled={Boolean(lastN)}
        clearable
      />

      <TextField
        type="number"
        value={lastN}
        name="lastN"
        onChange={e => setLastN(e.target.value)}
        variant="outlined"
        label="Últimas N observações"
      />

      {children}

      <Button type="submit" variant="contained" color="primary">
        Filtrar
      </Button>
    </form>
  );
}
