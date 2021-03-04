import { ChartJS } from "components";
import * as React from "react";

export function BarChart({ metadata, ...rest }) {
  return (
    <ChartJS
      {...rest}
      chartType="bar"
      title={{ display: true, text: metadata.SERNOME }}
      yScale={{
        type: "linear",
        scaleLabel: { display: true, labelString: metadata.UNINOME },
      }}
    />
  );
}
