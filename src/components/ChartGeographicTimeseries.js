import React from "react";
import groupBy from "lodash.groupby";
import ChartTimeseries from "./ChartTimeseries";

export default function ChartGeographicTimeseries({ series, metadata }) {
  const datasets = Object.entries(groupBy(series, "TERNOME")).map(
    ([level, values]) => ({
      label: level,
      data: values.map(series => series.VALVALOR)
    })
  );

  const labels = [...new Set(series.map(series => series.VALDATA))];

  return (
    <ChartTimeseries labels={labels} datasets={datasets} metadata={metadata} />
  );
}
