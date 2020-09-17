import React, { useState } from "react";
import { DatePicker } from "@material-ui/pickers";

const dateViewsByPeriodicity = {
  Mensal: ["year", "month"],
  Anual: ["year"]
};

export default function ChartFormDates({ metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);

  const resetDate = date => {
    if (!date) return;

    if (metadata.PERNOME !== "Diária") {
      date.setDate(1);
    }

    if (metadata.PERNOME !== "Mensal") {
      date.setMonth(0);
    }
  };

  const minDate = new Date(metadata.SERMINDATA)
  const maxDate = new Date(metadata.SERMAXDATA)

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
    </>
  );
}
