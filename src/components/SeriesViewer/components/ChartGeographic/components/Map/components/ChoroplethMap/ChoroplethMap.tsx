import React, { useState } from "react";

import { useQuery } from "react-query";

import { Geographies, Geography } from "react-simple-maps";
import { schemeBlues as palette } from "d3-scale-chromatic";
import { scaleQuantile } from "d3-scale";

import {
  getMapUrl,
  IbgeMapDivision,
  divisionMetadataType,
  getDivisionsMetadata,
  BoundaryDivisionToSelect,
} from "api/ibge";
import { formatDate } from "api/date-utils";
import { SeriesMetadata, SeriesValues } from "components/types";
import { Feature } from "geojson";

import { ChartLoading } from "components/common";
import { MapWrapper, SelectDate } from "./components";

import keyBy from "lodash/keyBy";
import groupBy from "lodash/groupBy";

async function getOutlineMap(_: string, boundaryId: string): Promise<Feature> {
  const url = getMapUrl({ boundaryId, format: "application/vnd.geo+json" });
  return await (await fetch(url)).json();
}

interface Props {
  series: SeriesValues[];
  metadata: SeriesMetadata;
  division: IbgeMapDivision;
  boundaryId: string;
  setTooltipPosition(state: {
    x: number | undefined;
    y: number | undefined;
  }): void;
  setTooltipText(state: string): void;
  setTooltipOpen(state: boolean): void;
}

export const ChoroplethMap: React.FC<Props> = React.memo(props => {
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
    isLoading: isLoadingDivisionsMetadata,
    data: divisionsMetadata,
  } = useQuery<divisionMetadataType[]>(
    ["Fetch geographic divisions metadata", division],
    (_: string, division: BoundaryDivisionToSelect) =>
      getDivisionsMetadata(division),
    { enabled: division }
  );

  const { isLoading: isLoadingOutlineMap, data: outline } = useQuery<Feature>(
    ["Fetch outline map given a boundary region id", boundaryId],
    getOutlineMap
  );

  const divisionsMetadataById =
    divisionsMetadata && keyBy(divisionsMetadata, "id");

  const seriesByDate = groupBy(series, row =>
    formatDate(new Date(row.VALDATA), { periodicity: metadata.PERNOME })
  );

  const dates = Object.keys(seriesByDate);

  if (date === "") {
    setDate(dates[0]);
  }

  const rowsInDate = seriesByDate[date] || {};
  const valuesInDate = Object.values(rowsInDate).map(row => row["VALVALOR"]);

  const scale = scaleQuantile<string>()
    .domain(valuesInDate)
    .range(palette[4]);

  const isLoading = isLoadingOutlineMap || isLoadingDivisionsMetadata;

  return (
    <>
      {isLoading ? (
        <ChartLoading />
      ) : (
        <MapWrapper scale={scale} metadata={metadata} outline={outline!}>
          <Geographies geography={getMapUrl({ boundaryId, division })}>
            {({ geographies }) =>
              geographies.map(geo => {
                const id = geo.properties.codarea;
                const name = divisionsMetadataById![id]["nome"];

                if (!name) return;

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
        </MapWrapper>
      )}

      <SelectDate
        isLoading={isLoading}
        date={date}
        dates={dates}
        handleChange={(e: any) => setDate(e.target.value)}
      />
    </>
  );
});
