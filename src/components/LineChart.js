import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import {
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

const useStyles = makeStyles(theme => ({
  formContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2)
  },
  dates: {
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

export default function LineChart({ code, metadata }) {
  const classes = useStyles();

  const [series, setSeries] = useState([]);
  const [isLog, setIsLog] = useState(false);

  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");

  const chartRef = useRef();

  useEffect(() => {
    const url = buildSeriesUrl(code);

    fetch(limitQuery(url, 50))
      .then(response => response.json())
      .then(json => {
        const series = json.value;
        setSeries(series);

        const firstDate = series[series.length - 1].VALDATA;
        const lastDate = series[0].VALDATA;

        setInitialDate(firstDate);
        setFinalDate(lastDate);
      });
  }, [code]);

  useEffect(() => {
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
        title: metadata.SERNOME,
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
  }, [series, code, metadata]);

  useEffect(() => {
    if (chartRef.current === undefined) return;

    chartRef.current.options.scales.yAxes[0].type = isLog
      ? "logarithmic"
      : "linear";
    chartRef.current.update(0);
  }, [isLog]);

  function handleSubmit(e) {
    e.preventDefault();
    const url = buildSeriesUrl(code);

    const { initial, final } = e.target.elements;

    const initialDate = initial.value;
    const finalDate = final.value;

    setInitialDate(initialDate);
    setFinalDate(finalDate);

    fetch(limitByDate(url, initialDate, finalDate))
      .then(response => response.json())
      .then(json => setSeries(json.value));
  }

  return (
    <>
      <div className={classes.formContainer}>
        <form className={classes.dates} onSubmit={handleSubmit}>
          <TextField
            size="small"
            label="Data inicial"
            name="initial"
            value={initialDate.slice(0, 10)}
            onChange={e => setInitialDate(e.target.value)}
            variant="outlined"
            type="date"
            inputProps={{
              min: metadata.SERMINDATA.slice(0, 10)
            }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            size="small"
            label="Data final"
            name="final"
            value={finalDate.slice(0, 10)}
            onChange={e => setFinalDate(e.target.value)}
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              max: metadata.SERMAXDATA.slice(0, 10)
            }}
          />

          <Button type="submit" variant="contained" color="primary">
            Filtrar
          </Button>
        </form>

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
      </div>

      <canvas id="line-chart" aria-label="Gráfico">
        <Typography paragraph>Gráfico da série de código {code}</Typography>
      </canvas>
    </>
  );
}
