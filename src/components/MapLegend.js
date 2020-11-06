// This module implements what is in https://observablehq.com/@d3/color-legend
import React, { useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/styles";

import { select as d3Select } from "d3-selection";
import { format as d3Format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { axisBottom } from "d3-axis";

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: "auto",
  },
}));

const width = 320;
const height = 44;
const marginTop = 18;
const marginRight = 0;
const marginBottom = 16;
const marginLeft = 0;
const tickSize = 6;

export function MapLegend({ scale, title }) {
  const classes = useStyles();

  const legendRef = useRef();

  const xScale = scaleLinear()
    .domain([-1, scale.range().length - 1])
    .rangeRound([marginLeft, width - marginRight]);

  const thresholds = scale.quantiles();

  const tickValues = Array.from({ length: thresholds.length }).map((_, i) => i);
  const tickFormatter = d3Format(">.0f");
  const tickFormat = i => tickFormatter(thresholds[i]);

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
    >
      <QuantileRectangles scale={scale} xScale={xScale} />
      <Ticks tickAxis={tickAxis} title={title} />
    </svg>
  );
}

function QuantileRectangles(props) {
  const { scale, xScale } = props;

  return (
    <g>
      {scale.range().map((color, index) => (
        <rect
          x={xScale(index - 1)}
          y={marginTop}
          width={xScale(index) - xScale(index - 1)}
          height={height - marginTop - marginBottom}
          fill={color}
        ></rect>
      ))}
    </g>
  );
}

function Ticks(props) {
  const ticksRef = useRef();
  const { title, tickAxis } = props;

  const tickAdjust = g =>
    g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

  useEffect(() => {
    d3Select(ticksRef.current)
      .call(tickAxis)
      .call(tickAdjust)
      .call(g => g.select(".domain").remove());
  }, [tickAxis, title]);

  return (
    <g transform={`translate(0,${height - marginBottom})`} ref={ticksRef}>
      <text
        x={marginLeft}
        y={marginTop + marginBottom - height - 6}
        fill="currentColor"
        text-anchor="start"
        font-weight="bold"
      >
        {title}
      </text>
    </g>
  );
}
