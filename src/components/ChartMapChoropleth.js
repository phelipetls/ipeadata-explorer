import React, { useEffect, useRef } from "react";
import ChartCanvas from "./ChartCanvas";
import Chart from "chart.js";
import "chartjs-chart-geo";

export default function ChartMapChoropleth({ labels, datasets, metadata }) {
  const chartRef = useRef();

  useEffect(() => {
    chartRef.current = new Chart("mapChart", {
      type: "choropleth",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        geo: {
          colorScale: {
            display: true,
            position: "bottom",
            quantize: 5,
            legend: {
              position: "bottom-right"
            }
          }
        },
        scale: {
          projection: "mercator"
        },
      }
    });

    return () => chartRef.current.destroy();
  }, [labels, datasets]);

  return <ChartCanvas id="mapChart" />;
}
