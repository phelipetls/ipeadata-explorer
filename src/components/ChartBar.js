import React from "react";

import { ChartJS } from "./ChartJS";
import { schemeCategory10 as palette } from "d3-scale-chromatic";

export function ChartBar(props) {
  const datasetsWithColors = props.datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: palette[index % palette.length],
  }));

  return (
    <ChartJS
      {...props}
      type="bar"
      datasets={datasetsWithColors}
      title={{ display: true, text: props.metadata.SERNOME }}
      yScale={{
        type: "linear",
        scaleLabel: { display: true, labelString: props.metadata.UNINOME },
      }}
    />
  );
}
