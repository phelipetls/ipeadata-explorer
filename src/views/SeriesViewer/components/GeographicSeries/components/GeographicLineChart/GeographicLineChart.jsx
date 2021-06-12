import * as React from "react";
import { LineChart } from "components";
import groupBy from "lodash/groupBy";

export function GeographicLineChart(props) {
  const { series, ...rest } = props;

  const labels = Array.from(new Set(series.map((row) => row.VALDATA)));

  const seriesByDivisions = groupBy(series, "TERNOME");

  const datasets = Object.entries(seriesByDivisions).map(
    ([division, rows]) => ({
      label: division,
      data: rows.map((row) => row.VALVALOR),
    })
  );

  return <LineChart labels={labels} datasets={datasets} {...rest} />;
}
