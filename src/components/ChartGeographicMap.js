import React from "react";

import { useQuery } from "react-query";

import { topojson } from "chartjs-chart-geo";
import { getMapUrl, getDivisionsUrl } from "../api/ibge";

import { ChartChoroplethMap } from "./ChartChoroplethMap";
import { ChartWrapper } from "./ChartWrapper";

import keyBy from "lodash.keyby";

async function fetchOutlineMap(geoBoundaryId) {
  const url = getMapUrl({ geoBoundaryId });
  const json = await (await fetch(url)).json();
  return topojson.feature(json, json.objects.foo).features;
}

async function fetchDivisionsMap(geoBoundaryId, geoDivision) {
  const url = getMapUrl({ geoBoundaryId, geoDivision });
  const json = await (await fetch(url)).json();
  return topojson.feature(json, json.objects.foo).features;
}

async function fetchDivisions(geoDivision) {
  const url = getDivisionsUrl(geoDivision);
  return await (await fetch(url)).json();
}

export function ChartGeographicMap(props) {
  const { series, metadata, geoDivision, geoBoundaryId } = props;

  const { isLoading: outlineMapIsLoading, data: outlineMap = [] } = useQuery(
    [geoBoundaryId],
    fetchOutlineMap
  );

  const {
    isLoading: divisionsMapIsLoading,
    data: divisionsMap = [],
  } = useQuery([geoBoundaryId, geoDivision], fetchDivisionsMap);

  const { isLoading: divisionsIsLoading, data: divisions = [] } = useQuery(
    [geoDivision],
    fetchDivisions
  );

  const divisionsById = keyBy(divisions, "id");

  const labels = divisionsMap.map(
    feature =>
      divisionsById[feature.properties.codarea]?.nome || "Não disponível"
  );

  const datasets = [
    {
      outline: outlineMap,
      data: divisionsMap.map(division => {
        return { feature: division, value: 0 };
      }),
    },
  ];

  const isLoading =
    outlineMapIsLoading || divisionsMapIsLoading || divisionsIsLoading;

  return (
    <ChartWrapper series={series} isLoading={isLoading}>
      <ChartChoroplethMap
        series={series}
        metadata={metadata}
        labels={labels}
        datasets={datasets}
      />
    </ChartWrapper>
  );
}
