import React, { useState, useEffect } from "react";
import { topojson } from "chartjs-chart-geo";
import ChartMapChoropleth from "./ChartMapChoropleth";

import { getMapUrl } from "../api/ibge";

export default function ChartGeographicMap(props) {
  const [outlineMap, setOutlineMap] = useState([]);
  const [detailedMap, setDetailedMap] = useState([]);

  const { series, metadata, geoDivision, geoBoundaryId } = props;

  useEffect(() => {
    async function fetchGeographicData() {
      const outlineMapUrl = getMapUrl({ geoBoundaryId });
      const detailedMapUrl = getMapUrl({ geoBoundaryId, geoDivision });

      const requests = [fetch(outlineMapUrl), fetch(detailedMapUrl)];

      const responses = await Promise.all(requests);
      const [outlineMapJson, detailedMapJson] = await Promise.all(
        responses.map(response => response.json())
      );

      setOutlineMap(
        topojson.feature(outlineMapJson, outlineMapJson.objects.foo).features
      );

      setDetailedMap(
        topojson.feature(detailedMapJson, detailedMapJson.objects.foo).features
      );
    }

    fetchGeographicData();
  }, [series, geoBoundaryId, geoDivision]);

  const labels = detailedMap.map(region => {
    const regionSeries = series.find(
      series => series.TERCODIGO === region.properties.codarea
    );
    return regionSeries ? regionSeries.TERNOME : "Não disponível";
  });

  const datasets = [
    {
      outline: outlineMap,
      data: detailedMap.map(region => {
        return { feature: region, value: 0 };
      }),
    },
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
