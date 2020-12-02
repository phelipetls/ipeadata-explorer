import React from "react";

import { LineChart } from "../LineChart";

import groupBy from "lodash/groupBy";

export function GeographicLineChart(props) {
  const { series, isLoading, ...rest } = props;

  const labels = [...new Set(series.map(row => row.VALDATA))];
  const seriesByDivisions = groupBy(series, "TERNOME");

  const datasets = Object.entries(seriesByDivisions).map(
    ([division, values]) => ({
      label: division,
      data: values.map(series => series.VALVALOR),
    })
  );

  return <LineChart {...rest} labels={labels} datasets={datasets} />;
}