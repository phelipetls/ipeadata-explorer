import React, { useState } from "react";

import { useQuery } from "react-query";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { schemeBlues as palette } from "d3-scale-chromatic";
import { geoMercator } from "d3-geo";
import { scaleQuantile } from "d3-scale";

import { useBreakpoint } from "../utils/responsive";
import { getMapUrl, getDivisionsUrl } from "../api/ibge";

import { MapLegend } from "./MapLegend";
import { SelectDates } from "./SelectDates";
import { ChartContainer } from "./ChartContainer";

import keyBy from "lodash/keyBy";

async function getOutlineMap(_, boundaryId) {
  const url = getMapUrl({ boundaryId, format: "application/vnd.geo+json" });
  return await (await fetch(url)).json();
}

async function getDivisionsNames(_, division) {
  const url = getDivisionsUrl(division);
  return await (await fetch(url)).json();
}

const SVG_WIDTH = 800;
const LEGEND_WIDTH = 320;

const TITLE_HEIGHT = 25;
const MAP_HEIGHT = 480;
const LEGEND_HEIGHT = 44;
const SVG_HEIGHT = MAP_HEIGHT + LEGEND_HEIGHT + TITLE_HEIGHT;

function getProjection(outline, { mapWidth, mapHeight }) {
  const boundingBox = [
    [0, TITLE_HEIGHT],
    [mapWidth, mapHeight],
  ];

  return geoMercator().fitExtent(boundingBox, outline);
}

export const ChartChoroplethMap = React.memo(props => {
  const isExtraSmallScreen = useBreakpoint("xs");

  const {
    isLoading: isLoadingSeries,
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
    ["Fetch geographic divisions names", division],
    getDivisionsNames
  );

  const divisionsNamesById = divisionsNames && keyBy(divisionsNames, "id");

  const isLoading =
    isLoadingSeries || isLoadingOutlineMap || isLoadingDivisionsNames;

  const dates = Object.keys(seriesByDate);
  const selectedDate = date || dates[0];

  const rowsInDate = dates.length > 0 ? seriesByDate[selectedDate] : {};
  const valuesInDate = Object.values(rowsInDate).map(row => row["VALVALOR"]);

  const colorScale = scaleQuantile()
    .domain(valuesInDate)
    .range(palette[4]);

  const svgWidth = Math.min(window.innerWidth, SVG_WIDTH);
  const svgHeight = SVG_HEIGHT;

  const projection = getProjection(outline, {
    mapWidth: svgWidth,
    mapHeight: MAP_HEIGHT,
  });

  return (
    <>
      <ChartContainer isLoading={isLoading} data={valuesInDate}>
        <ComposableMap
          width={svgWidth}
          height={svgHeight}
          projection={projection}
        >
          <text
            x={svgWidth / 2}
            text-anchor="middle"
            dominant-baseline="hanging"
          >
            {metadata.SERNOME}
          </text>

          <Geographies geography={getMapUrl({ boundaryId, division })}>
            {({ geographies }) =>
              geographies.map(geo => {
                const id = geo.properties.codarea;
                const name = divisionsNamesById[id]["nome"];
                const divisionValue = rowsInDate.find(
                  row => row["TERCODIGO"] === id
                );
                const value = (divisionValue && divisionValue["VALVALOR"]) || 0;
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

          <MapLegend
            scale={colorScale}
            title={metadata.UNINOME}
            width={LEGEND_WIDTH}
            height={LEGEND_HEIGHT}
            x={
              isExtraSmallScreen
                ? (svgWidth - LEGEND_WIDTH) / 2
                : svgWidth - LEGEND_WIDTH
            }
            y={SVG_HEIGHT - LEGEND_HEIGHT - 1}
          />
        </ComposableMap>
      </ChartContainer>

      <SelectDates
        isLoading={isLoading}
        date={selectedDate}
        dates={dates}
        handleChange={e => setDate(e.target.value)}
      />
    </>
  );
});
