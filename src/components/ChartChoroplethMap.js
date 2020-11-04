import React, { useState } from "react";

import { useQuery } from "react-query";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { schemeBlues as palette } from "d3-scale-chromatic";

import { geoMercator } from "d3-geo";
import { scaleQuantile } from "d3-scale";
import { getMapUrl, getDivisionsUrl } from "../api/ibge";

import { Loading } from "./Loading";
import { MapLegend } from "./MapLegend";
import { SelectDates } from "./SelectDates";

import keyBy from "lodash.keyby";

async function getOutlineMap(_, boundaryId) {
  const url = getMapUrl({ boundaryId, format: "application/vnd.geo+json" });
  return await (await fetch(url)).json();
}

async function getDivisionsNames(_, division) {
  const url = getDivisionsUrl(division);
  const json = await (await fetch(url)).json();
  return keyBy(json, "id");
}

function getProjection(outline, width, height) {
  const padding = 20;

  const boundingBox = [
    [padding, padding],
    [width, height],
  ];

  return geoMercator().fitExtent(boundingBox, outline);
}

export const ChartChoroplethMap = React.memo(props => {
  const {
    seriesByDate,
    metadata,
    division,
    boundaryId,
    setTooltipPosition,
    setTooltipText,
    setTooltipOpen,
  } = props;

  const [date, setDate] = useState("");

  const { isLoading: isLoadingOutlineMap, data: outline } = useQuery(
    ["Fetch outline map given a boundary region", boundaryId],
    getOutlineMap
  );

  const { isLoading: isLoadingDivisionsNames, data: divisionsNames } = useQuery(
    ["Fetch all geographic divisions names", division],
    getDivisionsNames
  );

  if (isLoadingOutlineMap || isLoadingDivisionsNames) {
    return <Loading />;
  }

  const dates = Object.keys(seriesByDate);
  const selectedDate = date || dates[0];

  const rowsInDate = seriesByDate[selectedDate];
  const valuesInDate = Object.values(rowsInDate).map(row => row["VALVALOR"]);

  const colorScale = scaleQuantile()
    .domain(valuesInDate)
    .range(palette[4]);

  const width = Math.min(window.innerWidth, 800);
  const height = 480;
  const projection = getProjection(outline, width, height);

  return (
    <>
      <ComposableMap width={width} height={height} projection={projection}>
        <Geographies geography={getMapUrl({ boundaryId, division })}>
          {({ geographies }) =>
            geographies.map(geo => {
              const id = geo.properties.codarea;
              const name = divisionsNames[id]["nome"];
              const value =
                rowsInDate.find(row => row["TERCODIGO"] === id)?.["VALVALOR"] ||
                0;
              return (
                <Geography
                  key={id}
                  geography={geo}
                  fill={colorScale(value)}
                  onMouseEnter={() => {
                    setTooltipOpen(true);
                    setTooltipText(`${name} ― ${value}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipOpen(false);
                    setTooltipText("");
                  }}
                  onMouseMove={e => {
                    setTooltipPosition({ x: e.clientX, y: e.clientY });
                  }}
                />
              );
            })
          }
        </Geographies>

        <MapLegend scale={colorScale} title={metadata.UNINOME} />
      </ComposableMap>

      <SelectDates
        date={selectedDate}
        dates={dates}
        handleChange={e => setDate(e.target.value)}
      />
    </>
  );
});
