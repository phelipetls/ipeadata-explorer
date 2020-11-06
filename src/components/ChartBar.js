import React from "react";

import { ChartJS } from "./ChartJS";
import { schemeCategory10 as palette } from "d3-scale-chromatic";

export function ChartBar({ metadata, datasets, ...rest }) {
  const datasetsWithColors = datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: palette[index % palette.length],
  }));

  return (
    <ChartJS
      {...rest}
      type="bar"
      datasets={datasetsWithColors}
      title={{ display: true, text: metadata.SERNOME }}
      yScale={{
        type: "linear",
        scaleLabel: { display: true, labelString: metadata.UNINOME },
      }}
    />
  );
}
