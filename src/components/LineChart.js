import React, { useState, useEffect, useRef } from "react";

import Chart from "chart.js";
import {
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  TextField
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

const useStyles = makeStyles(theme => ({
  canvasContainer: {
    position: "relative",
    minHeight: 512,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  form: {
    width: "100%",
    display: "flex",
    flexFlow: "column",
    [theme.breakpoints.up("md")]: {
      flexFlow: "row wrap"
    },
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

const dateViewsByPeriodicity = {
  Mensal: ["year", "month"],
  Anual: ["year"]
};

export default function LineChart({ code, metadata }) {
  const classes = useStyles();

  const [series, setSeries] = useState([]);
  const [isLog, setIsLog] = useState(false);

  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(null);

  const chartRef = useRef();

  useEffect(
    function fetchSeriesValues() {
      const url = buildSeriesUrl(code);

      fetch(limitQuery(url, 50))
        .then(response => response.json())
        .then(json => {
          const series = json.value;

          setSeries(series);

          if (series.length > 0) {
            const initialDate = series[series.length - 1].VALDATA;
            const finalDate = series[0].VALDATA;

            setInitialDate(new Date(initialDate));
            setFinalDate(new Date(finalDate));
          }
        });
    },
    [code]
  );

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
  }, [series, code, metadata]);

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate } = e.target.elements;

    let url;
    const baseUrl = buildSeriesUrl(code);

    if (lastN) {
      url = limitQuery(baseUrl, lastN);
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
      <form className={classes.form} onSubmit={handleSubmit}>
        <DatePicker
          name="initialDate"
          label="Data inicial"
          value={initialDate}
          onChange={setInitialDate}
          minDate={metadata.SERMINDATA.slice(0, 10)}
          format="dd/MM/yyyy"
          views={dateViewsByPeriodicity[metadata.PERNOME]}
          disabled={Boolean(lastN)}
          inputVariant="outlined"
          clearable
        />

        <DatePicker
          name="finalDate"
          label="Data final"
          value={finalDate}
          onChange={setFinalDate}
          maxDate={new Date(metadata.SERMAXDATA)}
          format="dd/MM/yyyy"
          views={dateViewsByPeriodicity[metadata.PERNOME]}
          inputVariant="outlined"
          disabled={Boolean(lastN)}
          clearable
        />

        <TextField
          type="number"
          value={lastN}
          onChange={e => setLastN(e.target.value)}
          variant="outlined"
          label="Últimas N observações"
        />

        <Button type="submit" variant="contained" color="primary">
          Filtrar
        </Button>
      </form>

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
