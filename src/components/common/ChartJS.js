import React, { useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/styles";
import { theme } from "styles";

import {
  Chart,
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
  BarController,
  LineController,
  CategoryScale,
  TimeScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
);

// FIXME: defining defaults not working
// Chart.defaults.controllers.point.radius = 0;
// Chart.defaults.controllers.point.hitRadius = 5;
// Chart.defaults.plugins.legend.position = "bottom";
// Chart.defaults.plugins.title.font = {
//   size: 16,
//   weight: 0,
//   family: "Roboto, sans-serif",
//   color: "black",
// };

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: theme.chart.height,
  },
});

export function ChartJS(props) {
  const classes = useStyles();
  const canvasRef = useRef(null);

  const { chartType, labels, datasets, xScale, yScale, ...options } = props;

  useEffect(() => {
    if (canvasRef.current === null) return;

    const config = {
      type: chartType,
      data: { labels, datasets },
      options: {
        maintainAspectRatio: false,
        scales: { x: xScale, y: yScale },
        ...options,
      },
    };

    const chart = new Chart(canvasRef.current, config);

    return () => chart.destroy();
  }, [chartType, labels, datasets, xScale, yScale, options]);

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
