import React, { useEffect, useRef } from "react";

import Chart from "chart.js";
import { Typography } from "@material-ui/core";
import ChartContainer from "./ChartContainer";

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

  return (
    <ChartContainer>
      <canvas id="lineChart" aria-label="Gráfico">
        <Typography paragraph>
          Gráfico da série de código {metadata.SERCODIGO}
        </Typography>
      </canvas>
    </ChartContainer>
  );
}
