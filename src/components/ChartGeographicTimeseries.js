import React from "react";

import { ChartTimeseries } from "./ChartTimeseries";

import groupBy from "lodash/groupBy";

export function ChartGeographicTimeseries(props) {
  const { series, isLoading, ...rest } = props;

  const labels = [...new Set(series.map(row => row.VALDATA))];

  const seriesByDivisions = groupBy(series, "TERNOME");

  const datasets = Object.entries(seriesByDivisions).map(
    ([division, values]) => ({
      label: division,
      data: values.map(series => series.VALVALOR),
    })
  );

  return <ChartTimeseries {...rest} labels={labels} datasets={datasets} />;
}
