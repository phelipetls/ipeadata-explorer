import React, { useEffect, useRef } from "react";

import { select as d3Select } from "d3-selection";
import { format as d3Format } from "d3-format";
import { legendColor } from "d3-svg-legend";

export function MapLegend({ scale, title }) {
  const legendRef = useRef();

  // const [marginLeft, setMarginLeft] = useState(20);
  // const [marginTop, setMarginTop] = useState(20);

  useEffect(() => {
    const legendContainer = d3Select(legendRef.current);

    const legend = legendColor()
      .scale(scale)
      .labelFormat(d3Format(".0f"))
      .labelDelimiter(" a ")
      .title(title);

    legendContainer.call(legend);

    //     const {
    //       width: legendWidth,
    //       height: legendHeight,
    //     } = legendRef.current.getBoundingClientRect();

    //     const {
    //       width: mapWidth,
    //       height: mapHeight,
    //     } = legendRef.current.parentElement.getBoundingClientRect();

    //     setMarginLeft(mapWidth - legendWidth);
    //     setMarginTop(mapHeight - legendHeight);
  }, [scale, title]);

  return <g ref={legendRef}></g>;
}
