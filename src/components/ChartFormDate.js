import React, { useState } from "react";

import { TextField } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";

const dateViewsByPeriodicity = {
  Mensal: ["year", "month"],
  Trimestral: ["year", "month"],
  Semestral: ["year", "month"],
  Anual: ["year"],
  Decenal: ["year"],
  Quadrienal: ["year"],
  Quinquenal: ["year"],
};

export default function ChartFormDate({ metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [topN, setTopN] = useState("");

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
      <DatePicker
        name="initialDate"
        label="Data inicial"
        value={initialDate}
        initialFocusedDate={maxDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={setInitialDate}
        onAccept={resetDate}
        format="dd/MM/yyyy"
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        inputVariant="outlined"
        clearable
      />

      <DatePicker
        name="finalDate"
        label="Data final"
        value={finalDate}
        initialFocusedDate={maxDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={setFinalDate}
        onAccept={resetDate}
        format="dd/MM/yyyy"
        views={dateViewsByPeriodicity[metadata.PERNOME]}
        inputVariant="outlined"
        clearable
      />

      <TextField
        type="number"
        value={topN}
        name="topN"
        onChange={e => setTopN(e.target.value)}
        variant="outlined"
        label="Top N"
      />
    </>
  );
}
