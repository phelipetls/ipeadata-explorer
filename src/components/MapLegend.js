import React, { useEffect, useRef } from "react";

import { select as d3Select } from "d3-selection";
import { format as d3Format } from "d3-format";
import { legendColor } from "d3-svg-legend";

export function MapLegend({ scale, title }) {
  const legendRef = useRef();

  useEffect(() => {
    const legendContainer = d3Select(legendRef.current);

    const legend = legendColor()
      .scale(scale)
      .labelFormat(d3Format(".0f"))
      .labelDelimiter(" a ")
      .title(title);

    legendContainer.call(legend);
  }, [scale, title]);

  return <g ref={legendRef}></g>;
}
