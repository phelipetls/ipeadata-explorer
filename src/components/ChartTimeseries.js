import React from "react";

import { ChartJS } from "./ChartJS";
import { schemeCategory10 as palette } from "d3-scale-chromatic";

export function ChartTimeseries(props) {
  const datasetsWithColors = props.datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: palette[index % palette.length],
    borderColor: palette[index % palette.length],
  }));

  return (
    <ChartJS
      {...props}
      type="line"
      datasets={datasetsWithColors}
      title={{ display: true, text: props.metadata.SERNOME }}
      xScale={{ type: "time", time: { unit: "month" } }}
      yScale={{
        type: "linear",
        scaleLabel: { display: true, labelString: props.metadata.UNINOME },
      }}
    />
  );
}
