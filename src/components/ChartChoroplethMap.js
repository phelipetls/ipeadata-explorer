import React, { useState } from "react";

import { useQuery } from "react-query";

import { Geographies, Geography } from "react-simple-maps";
import { schemeBlues as palette } from "d3-scale-chromatic";
import { scaleQuantile } from "d3-scale";

import { getMapUrl, getDivisionsUrl } from "../api/ibge";
import { formatDate } from "../api/date-utils";

import { SelectDates } from "./SelectDates";
import { ChartLoading } from "./ChartLoading";
import { ChartMap } from "./ChartMap";

import keyBy from "lodash/keyBy";
import groupBy from "lodash/groupBy";

async function getOutlineMap(_, boundaryId) {
  const url = getMapUrl({ boundaryId, format: "application/vnd.geo+json" });
  return await (await fetch(url)).json();
}

async function fetchGeographicDivisionsNames(_, division) {
  const url = getDivisionsUrl(division);
  return await (await fetch(url)).json();
}

export const ChartChoroplethMap = React.memo(props => {
  const {
    series,
    metadata,
    division,
    boundaryId,
    setTooltipPosition,
    setTooltipText,
    setTooltipOpen,
  } = props;

  const [date, setDate] = useState("");

  const {
    isLoading: isLoadingDivisionsNames,
    data: divisionsNames,
  } = useQuery(
    ["Fetch geographic divisions names", division],
    fetchGeographicDivisionsNames,
    { enabled: division }
  );

  const { isLoading: isLoadingOutlineMap, data: outline } = useQuery(
    ["Fetch outline map given a boundary region id", boundaryId],
    getOutlineMap
  );

  const divisionsNamesById = divisionsNames && keyBy(divisionsNames, "id");

  const seriesByDate = groupBy(series, row =>
    formatDate(new Date(row.VALDATA), { periodicity: metadata.PERNOME })
  );

  const dates = Object.keys(seriesByDate);

  if (date === "") {
    setDate(dates[0]);
  }

  const rowsInDate = seriesByDate[date] || {};
  const valuesInDate = Object.values(rowsInDate).map(row => row["VALVALOR"]);

  const scale = scaleQuantile()
    .domain(valuesInDate)
    .range(palette[4]);

  const isLoading = isLoadingOutlineMap || isLoadingDivisionsNames;

  return (
    <>
      {isLoading ? (
        <ChartLoading />
      ) : (
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
      )}

      <SelectDates
        isLoading={isLoading}
        date={date}
        dates={dates}
        handleChange={e => setDate(e.target.value)}
      />
    </>
  );
});
