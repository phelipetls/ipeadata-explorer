import * as React from "react";
import { ChartJS } from "./ChartJS";

const getXAxisTimeScale = periodicity => {
  switch (periodicity) {
    case "Trimestral":
      return "quarter";
    case "Diária":
      return "day";
    case "Mensal":
      return "month";
    default:
      return "year";
  }
};

export function LineChart({ metadata, ...rest }) {
  return (
    <ChartJS
      {...rest}
      chartType="line"
      title={{ display: true, text: metadata.SERNOME }}
      xScale={{
        type: "time",
        time: { unit: getXAxisTimeScale(metadata.PERNOME) },
      }}
      yScale={{
        type: "linear",
        scaleLabel: {
          display: true,
          labelString: metadata.UNINOME || metadata.SERNOME,
        },
      }}
    />
  );
}
