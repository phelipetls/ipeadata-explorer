import React, { useState, useEffect, useRef, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Select } from "@material-ui/core";
import ChartCanvas from "./ChartCanvas";
import Chart from "chart.js";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";
import "chartjs-chart-geo";

const useStyles = makeStyles(theme => ({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const getYearIsoDate = date => date.slice(0, 4);
const getYearAndMonthIsoDate = date => date.slice(0, 7);

export default function ChartMapChoropleth(props) {
  const classes = useStyles();
  const chartRef = useRef();
  const [period, setPeriod] = useState(null);

  const { series, metadata, labels, datasets } = props;

  const seriesByGroup = useMemo(
    () => {
      const seriesByGroup = groupBy(series, row =>
        metadata.PERNOME === "Anual" || metadata.PERNOME === "Decenal"
          ? getYearIsoDate(row.VALDATA)
          : getYearAndMonthIsoDate(row.VALDATA)
      )

      for (const [year, value] of Object.entries(seriesByGroup)) {
        seriesByGroup[year] = keyBy(value, "TERCODIGO");
      };

      return seriesByGroup;
    },
    [series, metadata]
  );

  const periods = Object.keys(seriesByGroup).reverse();

  useEffect(() => {
    chartRef.current = new Chart("mapChart", {
      type: "choropleth",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        geo: {
          colorScale: {
            display: true,
            position: "bottom",
            quantize: 5,
            legend: {
              position: "bottom-right"
            }
          }
        },
        scale: {
          projection: "mercator"
        }
      }
    });

    return () => chartRef.current.destroy();
  }, [labels, datasets]);

  useEffect(() => {
    const seriesInCurrentPeriod = seriesByGroup[period || periods[0]];

    chartRef.current.data.datasets[0].data.forEach(region => {
      const regionCode = region.feature.properties.codarea
      const regionValues = seriesInCurrentPeriod[regionCode]
      region.value = regionValues ? regionValues.VALVALOR : 0;
    });

    chartRef.current.update(0);
  }, [period, periods, seriesByGroup]);

  return (
    <>
      <ChartCanvas id="mapChart" />;
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
