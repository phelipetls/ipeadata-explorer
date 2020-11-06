import React, { useEffect, useRef } from "react";

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
Chart.defaults.plugins.legend.position = "bottom";
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.title.font = {
  size: 16,
  family: "Roboto, sans-serif",
  weight: 0,
};

export function ChartJS(props) {
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
    <canvas ref={canvasRef} aria-label="Gráfico">
      <p>Gráfico</p>
    </canvas>
  );
}
