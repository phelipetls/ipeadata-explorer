import * as React from "react";

import { select as d3Select } from "d3-selection";
import { NumberValue } from "d3-scale";
import { Axis } from "d3-axis";

interface TicksProps {
  title: string;
  tickAxis: Axis<NumberValue>;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
}

export function Ticks(props: TicksProps) {
  const ticksRef = React.useRef<SVGGElement | null>(null);

  const {
    title,
    tickAxis,
    height,
    marginTop,
    marginBottom,
    marginLeft,
  } = props;

  React.useEffect(() => {
    d3Select(ticksRef.current!)
      .call(tickAxis)
      .call(g =>
        g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height)
      )
      .call(g => g.select(".domain").remove());
  }, [tickAxis, marginTop, marginBottom, title, height]);

  return (
    <g transform={`translate(0,${height - marginBottom})`} ref={ticksRef}>
      <text
        x={marginLeft}
        y={marginTop + marginBottom - height - 6}
        fill="currentColor"
        textAnchor="start"
        fontWeight="bold"
      >
        {title}
      </text>
    </g>
  );
}
