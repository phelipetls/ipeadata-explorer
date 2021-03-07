import { makeStyles } from "@material-ui/styles";
import { axisBottom } from "d3-axis";
import { format as d3Format } from "d3-format";
import { scaleLinear, ScaleQuantile } from "d3-scale";
import * as React from "react";
import { QuantileRectangles, Ticks } from "./components";

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

interface Props {
  scale: ScaleQuantile<string>;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function MapLegend(props: Props) {
  const classes = useStyles();
  const legendRef = React.useRef<SVGSVGElement | null>(null);

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
  const tickFormat = (_: any, index: number) =>
    tickFormatter(tickLabels[index]);

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
      <QuantileRectangles
        scale={scale}
        xScale={xScale}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
      />
      <Ticks
        tickAxis={tickAxis}
        title={title}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
      />
    </svg>
  );
}
