import React, { useState, useEffect, useMemo } from "react";
import { Select } from "@material-ui/core";
import { topojson } from "chartjs-chart-geo";
import { makeStyles } from "@material-ui/core/styles";
import groupBy from "lodash.groupby";
import ChartMapChoropleth from "./ChartMapChoropleth";

const useStyles = makeStyles(theme => ({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const IbgeMapResolution = {
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5
};

const getYearIsoDate = date => date.slice(0, 4);
const getYearAndMonthIsoDate = date => date.slice(0, 7);

export default function ChartGeographicMap({ series, metadata, geoLevel }) {
  const classes = useStyles();

  const [period, setPeriod] = useState("");
  const [regions, setRegions] = useState([]);
  const [brazil, setBrazil] = useState([]);

  useEffect(() => {
    const resolution = IbgeMapResolution[geoLevel];

    const brazilUrl =
      "https://servicodados.ibge.gov.br/api/v2/malhas/BR?formato=application/json";

    const regionsUrl =
      "https://servicodados.ibge.gov.br/api/v2/malhas/BR?" +
      `resolucao=${resolution}` +
      "&formato=application/json";

    const requests = [fetch(brazilUrl), fetch(regionsUrl)];

    Promise.all(requests)
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then(([brazilJson, regionsJson]) => {
        const brazil = topojson.feature(brazilJson, brazilJson.objects.foo)
          .features;
        const regions = topojson.feature(regionsJson, regionsJson.objects.foo)
          .features;

        setBrazil(brazil);
        setRegions(regions);
      });
  }, [series, geoLevel]);

  const seriesByPeriod = useMemo(
    () =>
      groupBy(series, row =>
        metadata.PERNOME === "Anual" || metadata.PERNOME === "Decenal"
          ? getYearIsoDate(row.VALDATA)
          : getYearAndMonthIsoDate(row.VALDATA)
      ),
    [series, metadata]
  );

  if (series.length === 0) return null;

  const periods = Object.keys(seriesByPeriod).reverse();
  const selectedSeries = seriesByPeriod[period || periods[0]];

  const labels = regions.map(
    region =>
      series.find(series => series.TERCODIGO === region.properties.codarea)
        .TERNOME
  );

  const datasets = [
    {
      outline: brazil,
      data: regions.map(region => {
        const regionData = selectedSeries.find(
          series => series.TERCODIGO === region.properties.codarea
        );
        const value = regionData !== undefined ? regionData.VALVALOR : 0;
        return { feature: region, value };
      })
    }
  ];

  return (
    <>
      <ChartMapChoropleth labels={labels} datasets={datasets} />

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
