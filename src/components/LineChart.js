import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import { Typography } from "@material-ui/core";
import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

import LineChartForm from "./LineChartForm";
import ChartContainer from "./ChartContainer";

export default function LineChart({ code, metadata }) {
  const [series, setSeries] = useState([]);

  const chartRef = useRef();

  useEffect(
    function fetchSeriesValues() {
      let url = buildSeriesUrl(code);

      fetch(limitQuery(url, 50))
        .then(response => response.json())
        .then(json => setSeries(json.value));
    },
    [code]
  );

  useEffect(
    function drawChart() {
      if (series.length === 0) return;

      chartRef.current = new Chart("line-chart", {
        type: "line",
        data: {
          labels: series.map(series => series.VALDATA),
          datasets: [
            {
              label: code,
              data: series.map(series => series.VALVALOR)
            }
          ]
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
                ticks: {
                  min: 0
                },
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
          }
        }
      });

      return () => chartRef.current.destroy();
    },
    [series, code, metadata]
  );

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    let url;
    const baseUrl = buildSeriesUrl(code);

    if (lastN.value) {
      url = limitQuery(baseUrl, lastN.value);
    } else if (initialDate.value || finalDate.value) {
      url = limitByDate(baseUrl, initialDate.value, finalDate.value);
    } else {
      return;
    }

    fetch(url)
      .then(response => response.json())
      .then(json => setSeries(json.value));
  }

  return (
    <>
      <LineChartForm metadata={metadata} onSubmit={handleSubmit} />

      <ChartContainer>
        <canvas id="line-chart" aria-label="Gráfico">
          <Typography paragraph>Gráfico da série de código {code}</Typography>
        </canvas>
      </ChartContainer>
    </>
  );
}
