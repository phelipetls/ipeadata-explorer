import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import { Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { buildSeriesUrl } from "../api/odata";

export default function LineChart({ code, metadata }) {
  const [series, setSeries] = useState([]);
  const [isLog, setIsLog] = useState(false);

  const chartRef = useRef();

  const url = buildSeriesUrl(code);

  useEffect(
    function fetchSeriesValues() {
      fetch(url)
        .then(response => response.json())
        .then(json => setSeries(json.value));
    },
    [url]
  );

  useEffect(() => {
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
        title: metadata.SERNOME,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "year"
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
  }, [series, code, metadata]);

  useEffect(() => {
    if (chartRef.current !== undefined) {
      chartRef.current.options.scales.yAxes[0].type = isLog
        ? "logarithmic"
        : "linear";
      chartRef.current.update(0);
    }
  }, [isLog]);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={isLog}
            onChange={() => setIsLog(isLog => !isLog)}
            name="log"
            color="primary"
            size="small"
          />
        }
        label="Log"
      />
      <canvas id="line-chart" aria-label="Gráfico">
        <Typography paragraph>Gráfico da série de código {code}</Typography>
      </canvas>
    </>
  );
}
