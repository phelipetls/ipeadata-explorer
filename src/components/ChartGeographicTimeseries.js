import React from "react";

import { ChartTimeseries } from "./ChartTimeseries";
import { ChartContainer } from "./ChartContainer";

import groupBy from "lodash/groupBy";

export function ChartGeographicTimeseries(props) {
  const { series, seriesByDate, isLoading, ...rest } = props;

  const labels = Object.keys(seriesByDate);

  const seriesByDivisions = groupBy(series, "TERNOME");
  const datasets = Object.entries(seriesByDivisions).map(
    ([division, values]) => ({
      label: division,
      data: values.map(series => series.VALVALOR),
    })
  );

  return (
    <ChartContainer isLoading={isLoading} data={series}>
      <ChartTimeseries {...rest} labels={labels} datasets={datasets} />
    </ChartContainer>
  );
}
