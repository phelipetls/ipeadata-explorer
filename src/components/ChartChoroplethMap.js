import React, { useState } from "react";

import { useQuery } from "react-query";

import { Geographies, Geography } from "react-simple-maps";
import { schemeBlues as palette } from "d3-scale-chromatic";
import { scaleQuantile } from "d3-scale";

import { getMapUrl, getDivisionsUrl } from "../api/ibge";

import { SelectDates } from "./SelectDates";
import { ChartContainer } from "./ChartContainer";
import { ChartMap } from "./ChartMap";

import keyBy from "lodash/keyBy";

async function getOutlineMap(_, boundaryId) {
  const url = getMapUrl({ boundaryId, format: "application/vnd.geo+json" });
  return await (await fetch(url)).json();
}

async function getDivisionsNames(_, division) {
  const url = getDivisionsUrl(division);
  return await (await fetch(url)).json();
}

export const ChartChoroplethMap = React.memo(props => {
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

  const { isLoading: isLoadingDivisionsNames, data: divisionsNames } = useQuery(
    ["Fetch geographic divisions names", division],
    getDivisionsNames
  );

  const { isLoading: isLoadingOutlineMap, data: outline } = useQuery(
    ["Fetch outline map given a boundary region", boundaryId],
    getOutlineMap
  );

  const isLoading =
    isLoadingSeries || isLoadingOutlineMap || isLoadingDivisionsNames;

  const divisionsNamesById = divisionsNames && keyBy(divisionsNames, "id");

  const dates = Object.keys(seriesByDate);
  const selectedDate = date || dates[0];

  const rowsInDate = dates.length > 0 ? seriesByDate[selectedDate] : {};
  const valuesInDate = Object.values(rowsInDate).map(row => row["VALVALOR"]);

  const scale = scaleQuantile()
    .domain(valuesInDate)
    .range(palette[4]);

  return (
    <>
      <ChartContainer isLoading={isLoading} data={valuesInDate}>
        <ChartMap scale={scale} metadata={metadata} outline={outline}>
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
                    fill={scale(value)}
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
        </ChartMap>
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
