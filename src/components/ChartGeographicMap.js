import React, { useState, useEffect } from "react";

import { topojson } from "chartjs-chart-geo";
import { getMapUrl, getRegionsUrl } from "../api/ibge";

import keyBy from "lodash.keyby";

import ChartChoroplethMap from "./ChartChoroplethMap";

export default function ChartGeographicMap(props) {
  const [outlineFeatures, setOutlineFeatures] = useState([]);
  const [regionsFeatures, setRegionsFeatures] = useState([]);
  const [regionsMetadata, setRegionsMetadata] = useState([]);

  const { series, metadata, geoDivision, geoBoundaryValue } = props;

  useEffect(() => {
    async function fetchGeographicData() {
      const outlineFeaturesUrl = getMapUrl({ geoBoundaryValue });
      const regionsFeaturesUrl = getMapUrl({ geoBoundaryValue, geoDivision });
      const regionsUrl = getRegionsUrl(geoDivision);

      const requests = [
        fetch(outlineFeaturesUrl),
        fetch(regionsFeaturesUrl),
        fetch(regionsUrl),
      ];

      const responses = await Promise.all(requests);
      const [
        outlineFeaturesJson,
        regionsFeaturesJson,
        regionsJson,
      ] = await Promise.all(responses.map(response => response.json()));

      setRegionsMetadata(regionsJson);

      setOutlineFeatures(
        topojson.feature(outlineFeaturesJson, outlineFeaturesJson.objects.foo)
          .features
      );

      setRegionsFeatures(
        topojson.feature(regionsFeaturesJson, regionsFeaturesJson.objects.foo)
          .features
      );
    }

    fetchGeographicData();
  }, [geoBoundaryValue, geoDivision]);

  const regionsById = keyBy(regionsMetadata, "id");

  const labels = regionsFeatures.map(feature => {
    return regionsById[feature.properties.codarea].nome || "Não disponível";
  });

  const datasets = [
    {
      outline: outlineFeatures,
      data: regionsFeatures.map(region => {
        return { feature: region, value: 0 };
      }),
    },
  ];

  return (
    <ChartChoroplethMap
      series={series}
      metadata={metadata}
      labels={labels}
      datasets={datasets}
    />
  );
}
