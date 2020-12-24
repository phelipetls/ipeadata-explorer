// This module implements what is in https://observablehq.com/@d3/color-legend
import React, { useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/styles";

import { select as d3Select } from "d3-selection";
import { format as d3Format } from "d3-format";
import { NumberValue, ScaleLinear, scaleLinear, ScaleQuantile } from "d3-scale";
import { Axis, axisBottom } from "d3-axis";

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: "auto",
  },
}));

const marginTop = 18;
const marginRight = 20;
const marginBottom = 16;
const marginLeft = 0;
const tickSize = 6;

type colorScaleType = ScaleQuantile<string>;
type xAxisScaleType = ScaleLinear<number, number>;

interface Props {
  scale: colorScaleType;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function MapLegend(props: Props) {
  const classes = useStyles();
  const legendRef = useRef<SVGSVGElement | null>(null);

  const { scale, title, width, height, ...rest } = props;

  const thresholds = scale.quantiles();

  const min = Math.min(...scale.domain());
  const max = Math.max(...scale.domain());
  const tickLabels = [min, ...thresholds, max];

  const xScale = scaleLinear()
    .domain([-1, scale.range().length - 1])
    .rangeRound([marginLeft, width - marginRight]);

  // We want two additional ticks (min and max)
  const tickValues = Array.from({ length: thresholds.length + 2 }).map(
    // xScale domain starts at -1
    (_, i) => i - 1
  );
  const tickFormatter = d3Format(">.0f");
  // i will take the value of xScale's domain. So we must add 1 because it
  // starts at -1
  const tickFormat = (_: any, index: number) =>
    tickFormatter(tickLabels[index + 1]);

  const tickAxis = axisBottom(xScale)
    .tickSize(tickSize)
    .tickFormat(tickFormat)
    .tickValues(tickValues);

  return (
    <svg
      className={classes.root}
      ref={legendRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      display="block"
      {...rest}
    >
      <QuantileRectangles scale={scale} xScale={xScale} height={height} />
      <Ticks tickAxis={tickAxis} title={title} height={height} />
    </svg>
  );
}

interface QuantileRectanglesProps {
  scale: colorScaleType;
  xScale: xAxisScaleType;
  height: number;
}

function QuantileRectangles(props: QuantileRectanglesProps) {
  const { scale, xScale, height } = props;

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

interface TicksProps {
  title: string;
  tickAxis: Axis<NumberValue>;
  height: number;
}

function Ticks(props: TicksProps) {
  const ticksRef = useRef<SVGGElement | null>(null);

  const { title, tickAxis, height } = props;

  useEffect(() => {
    d3Select(ticksRef.current!)
      .call(tickAxis)
      .call(g =>
        g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height)
      )
      .call(g => g.select(".domain").remove());
  }, [tickAxis, title, height]);

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
