import { ScaleLinear, ScaleQuantile } from "d3-scale";
import * as React from "react";

interface QuantileRectanglesProps {
  scale: ScaleQuantile<string>;
  xScale: ScaleLinear<number, number>;
  height: number;
  marginTop: number;
  marginBottom: number;
}

export function QuantileRectangles(props: QuantileRectanglesProps) {
  const { scale, xScale, height, marginTop, marginBottom } = props;

  return (
    <g>
      {scale.range().map((color, index) => (
        <rect
          key={index}
          x={xScale(index - 1)}
          y={marginTop}
          width={xScale(index) - xScale(index - 1)}
          height={height - marginTop - marginBottom}
          fill={color}
        />
      ))}
    </g>
  );
}
