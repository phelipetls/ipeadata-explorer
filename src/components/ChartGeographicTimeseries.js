import React from "react";

import { ChartTimeseries } from "./ChartTimeseries";

import groupBy from "lodash/groupBy";

export function ChartGeographicTimeseries({ series, seriesByDate, ...props }) {
  const labels = Object.keys(seriesByDate);

  const seriesByDivisions = groupBy(series, "TERNOME");
  const datasets = Object.entries(seriesByDivisions).map(
    ([division, values]) => ({
      label: division,
      data: values.map(series => series.VALVALOR),
    })
  );

  return <ChartTimeseries {...props} labels={labels} datasets={datasets} />;
}
