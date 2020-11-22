import React from "react";

import { ChartJS } from "./ChartJS";
import { schemeCategory10 as palette } from "d3-scale-chromatic";

const timeUnits = {
  Trimestral: "quarter",
  Diária: "day",
  Mensal: "month",
};

export function LineChart({ metadata, datasets, ...rest }) {
  const coloredDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: palette[index % palette.length],
    borderColor: palette[index % palette.length],
  }));

  const periodicity = metadata.PERNOME;

  return (
    <ChartJS
      {...rest}
      type="line"
      datasets={coloredDatasets}
      title={{ display: true, text: metadata.SERNOME }}
      xScale={{
        type: "time",
        time: { unit: timeUnits[periodicity] || "year" },
      }}
      yScale={{
        type: "linear",
        scaleLabel: { display: true, labelString: metadata.UNINOME },
      }}
    />
  );
}
