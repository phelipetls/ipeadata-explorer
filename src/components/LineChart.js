import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import { Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

import LineChartForm from "./LineChartForm";

const useStyles = makeStyles(theme => ({
  canvasContainer: {
    position: "relative",
    minHeight: 512,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
}));

export default function LineChart({ code, metadata }) {
  const classes = useStyles();

  const [series, setSeries] = useState([]);
  const [isLog, setIsLog] = useState(false);

  const chartRef = useRef();

  useEffect(
    function fetchSeriesValues() {
      const url = buildSeriesUrl(code);

      fetch(limitQuery(url, 50))
        .then(response => response.json())
        .then(json => setSeries(json.value));
    },
    [code]
  );

  useEffect(
    function drawChart() {
      if (!series) return;

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

  useEffect(() => {
    if (chartRef.current === undefined) return;

    chartRef.current.options.scales.yAxes[0].type = isLog
      ? "logarithmic"
      : "linear";
    chartRef.current.update(0);
  }, [isLog]);

  return (
    <>
      <LineChartForm metadata={metadata} onSubmit={handleSubmit} />

      <div className={classes.canvasContainer}>
        <canvas id="line-chart" aria-label="Gráfico">
          <Typography paragraph>Gráfico da série de código {code}</Typography>
        </canvas>
      </div>

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
    </>
  );
}
