import React, { useState, useEffect, useRef, useMemo } from "react";

import { Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Chart from "chart.js";
import "chartjs-adapter-date-fns";
import "chartjs-chart-geo";

import ChartCanvas from "./ChartCanvas";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

const useStyles = makeStyles(() => ({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const getYearIsoDate = date => date.slice(0, 4);
const getYearAndMonthIsoDate = date => date.slice(0, 7);

export default function ChartChoroplethMap(props) {
  const classes = useStyles();
  const chartRef = useRef();
  const [period, setPeriod] = useState(null);

  const { series, metadata, labels, datasets } = props;

  const seriesByGroup = useMemo(() => {
    const seriesByGroup = groupBy(series, row =>
      metadata.PERNOME === "Anual" ||
      metadata.PERNOME === "Decenal" ||
      metadata.PERNOME === "Quadrienal" ||
      metadata.PERNOME === "Quinquenal"
        ? getYearIsoDate(row.VALDATA)
        : getYearAndMonthIsoDate(row.VALDATA)
    );

    for (const [year, value] of Object.entries(seriesByGroup)) {
      seriesByGroup[year] = keyBy(value, "TERCODIGO");
    }

    return seriesByGroup;
  }, [series, metadata]);

  const periods = Object.keys(seriesByGroup).reverse();

  useEffect(() => {
    chartRef.current = new Chart("mapChart", {
      type: "choropleth",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        geo: {
          colorScale: {
            display: true,
            position: "bottom",
            quantize: 5,
            legend: {
              position: "bottom-right",
            },
          },
        },
        scale: {
          projection: "mercator",
        },
      },
    });

    return () => chartRef.current.destroy();
  }, [labels, datasets]);

  useEffect(() => {
    const seriesInCurrentPeriod = seriesByGroup[period || periods[0]];

    chartRef.current.data.datasets[0].data.forEach(region => {
      const regionCode = region.feature.properties.codarea;
      const regionValue = seriesInCurrentPeriod[regionCode];
      region.value = regionValue ? regionValue.VALVALOR : 0;
    });

    chartRef.current.update(0);
  }, [period, periods, seriesByGroup]);

  return (
    <>
      <ChartCanvas id="mapChart" />

      <div className={classes.center}>
        <Select
          native
          variant="outlined"
          label="Períodos"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          {periods.map(period => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}
