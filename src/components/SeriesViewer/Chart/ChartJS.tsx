import React, { useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/styles";

import {
  Chart,
  Line,
  Point,
  Rectangle,
  BarController,
  LineController,
  CategoryScale,
  TimeScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(
  Line,
  Point,
  Rectangle,
  BarController,
  LineController,
  CategoryScale,
  TimeScale,
  LinearScale,
  Title,
  Legend,
  Tooltip
);

Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.point.hitRadius = 5;
Chart.defaults.plugins.legend.position = "bottom";
Chart.defaults.plugins.title.font = {
  size: 16,
  weight: 0,
  family: "Roboto, sans-serif",
  color: "black",
};

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    height: theme.chart.height,
  },
}));

export function ChartJS(props) {
  const classes = useStyles();
  const canvasRef = useRef();

  const { type, labels, datasets, xScale, yScale, ...options } = props;

  useEffect(() => {
    const config = {
      type,
      data: { labels, datasets },
      options: {
        maintainAspectRatio: false,
        scales: { x: xScale, y: yScale },
        ...options,
      },
    };

    const chart = new Chart(canvasRef.current, config);

    return () => chart.destroy();
  }, [type, labels, datasets, xScale, yScale, options]);

  return (
    <div className={classes.root}>
      <canvas
        ref={canvasRef}
        id="chart-id"
        data-testid="chart-id"
        aria-label="Gráfico"
      >
        <p>Gráfico</p>
      </canvas>
    </div>
  );
}
