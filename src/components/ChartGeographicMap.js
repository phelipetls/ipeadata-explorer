import React, { useState, useEffect } from "react";
import { topojson } from "chartjs-chart-geo";
import ChartMapChoropleth from "./ChartMapChoropleth";

const IbgeMapResolution = {
  Estados: 2,
  Mesorregiões: 3,
  Microrregiões: 4,
  Municípios: 5
};

export default function ChartGeographicMap({ series, metadata, geoLevel }) {
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

  const labels = regions.map(
    region =>
      series.find(series => series.TERCODIGO === region.properties.codarea)
        .TERNOME
  );

  const datasets = [
    {
      outline: brazil,
      data: regions.map(region => {
        return { feature: region, value: 0 };
      })
    }
  ];

  return (
    <ChartMapChoropleth
      series={series}
      metadata={metadata}
      labels={labels}
      datasets={datasets}
    />
  );
}
