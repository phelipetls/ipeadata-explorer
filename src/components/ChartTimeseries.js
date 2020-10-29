import React, { useEffect, useRef } from "react";

import { ChartCanvas } from "./ChartCanvas";

import Chart from "chart.js";
import "chartjs-adapter-date-fns";
import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Paired12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

Chart.defaults.global.elements.line.fill = false;

const getYears = dates => new Set([...dates.map(date => date.slice(0, 4))]);

export function ChartTimeseries({ labels, datasets, metadata }) {
  const chartRef = useRef();

  useEffect(() => {
    chartRef.current = new Chart("lineChart", {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          fontSize: 14,
          text: metadata.SERNOME,
        },
        legend: {
          position: "bottom",
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit:
                  metadata.PERNOME === "Trimestral"
                    ? "quarter"
                    : getYears(labels).length > 1
                    ? "year"
                    : "month",
              },
            },
          ],
          yAxes: [
            {
              type: "linear",
              scaleLabel: {
                display: true,
                labelString: metadata.UNINOME,
              },
            },
          ],
        },
        plugins: {
          colorschemes: {
            scheme: Paired12,
          },
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem) {
              return new Date(tooltipItem[0].label).toLocaleDateString();
            },
          },
        },
      },
    });

    return () => chartRef.current.destroy();
  }, [labels, datasets, metadata]);

  return <ChartCanvas id="lineChart" />;
}
