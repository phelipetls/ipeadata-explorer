import React, { useEffect, useRef } from "react";

import Chart from "chart.js";
import "chartjs-adapter-date-fns";
import ChartCanvas from "./ChartCanvas";

import "chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes";
import { Paired12 } from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer";

Chart.defaults.global.elements.line.fill = false;

const timeUnits = {
  Mensal: "month",
  Diária: "day",
  Anual: "year",
  Trimestral: "quarter",
};

export default function ChartTimeseries({ labels, datasets, metadata }) {
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
                unit: timeUnits[metadata.PERNOME] || "year",
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
