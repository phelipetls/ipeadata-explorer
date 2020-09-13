import React, { useEffect, useRef } from "react";

import Chart from "chart.js";
import ChartCanvas from "./ChartCanvas";

import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Paired12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

Chart.defaults.global.elements.line.fill = false;

export default function ChartTimeseries({ labels, datasets, metadata }) {
  const chartRef = useRef();

  useEffect(() => {
    chartRef.current = new Chart("lineChart", {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        title: {
          text: metadata.SERNOME
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "month"
              }
            }
          ],
          yAxes: [
            {
              type: "linear",
              scaleLabel: {
                display: true,
                labelString: metadata.UNINOME
              }
            }
          ]
        },
        plugins: {
          colorschemes: {
            scheme: Paired12
          }
        }
      }
    });

    return () => chartRef.current.destroy();
  }, [labels, datasets, metadata]);

  return <ChartCanvas id="lineChart" />;
}
