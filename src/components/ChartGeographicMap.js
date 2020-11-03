import React from "react";

import { useQuery } from "react-query";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { geoMercator } from "d3-geo";
import { scaleQuantile } from "d3-scale";
import { schemeBlues as palette } from "d3-scale-chromatic";

import { getMapUrl } from "../api/ibge";

import { Loading } from "./Loading";

import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

async function getOutlineMap(geoBoundaryId) {
  const url = getMapUrl({ geoBoundaryId, format: "application/vnd.geo+json" });

  const response = await fetch(url);
  return await response.json();
}

function getProjection(outline, width, height) {
  const padding = 20;

  const boundingBox = [
    [padding, padding],
    [width, height],
  ];

  return geoMercator().fitExtent(boundingBox, outline);
}

export function ChartGeographicMap(props) {
  const { series, geoDivision, geoBoundaryId } = props;

  const rowsByPeriod = groupBy(series, "VALDATA");

  for (const [year, value] of Object.entries(rowsByPeriod)) {
    rowsByPeriod[year] = keyBy(value, "TERCODIGO");
  }

  const periods = Object.keys(rowsByPeriod);
  const period = periods[0];

  const rowsInPeriod = rowsByPeriod[period];
  const valuesInPeriod = Object.values(rowsInPeriod).map(
    row => row["VALVALOR"]
  );

  const colorScale = scaleQuantile()
    .domain(valuesInPeriod)
    .range(palette[4]);

  const { isLoading, data: outline } = useQuery([geoBoundaryId], getOutlineMap);

  if (isLoading) return <Loading />;

  const width = Math.min(window.innerWidth, 800);
  const height = 480;
  const projection = getProjection(outline, width, height);

  return (
    <ComposableMap width={width} height={height} projection={projection}>
      <Geographies geography={getMapUrl({ geoBoundaryId, geoDivision })}>
        {({ geographies }) =>
          geographies.map(geo => {
            const id = geo.properties.codarea;
            const value = rowsByPeriod[period][id]["VALVALOR"];
            return (
              <Geography key={id} geography={geo} fill={colorScale(value)} />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
