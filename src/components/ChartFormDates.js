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
    if (metadata.PERNOME !== "Diária") {
      date.setDate(1);
    }

    if (metadata.PERNOME !== "Mensal") {
      date.setMonth(0);
    }
  };

  return (
    <>
      <DatePicker
        name="initialDate"
        label="Data inicial"
        value={initialDate}
        minDate={new Date(metadata.SERMINDATA)}
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
        maxDate={new Date(metadata.SERMAXDATA)}
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
