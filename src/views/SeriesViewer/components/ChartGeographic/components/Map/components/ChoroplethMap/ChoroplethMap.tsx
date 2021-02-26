import * as React from "react";

import axios from "redaxios";
import { useQuery } from "react-query";

import { Geographies, Geography } from "react-simple-maps";
import { schemeBlues as palette } from "d3-scale-chromatic";
import { scaleQuantile } from "d3-scale";

import {
  getMapUrl,
  DivisionMetadata,
  fetchDivisionNames,
  DivisionToPlotAsMap,
} from "api/ibge";
import { formatDate } from "utils";
import { SeriesMetadata, SeriesValues } from "types";
import { Feature } from "geojson";

import { ChartLoading } from "components";
import { MapWrapper, SelectDate } from "./components";

import keyBy from "lodash/keyBy";
import groupBy from "lodash/groupBy";

async function getOutlineMap(boundaryId: string): Promise<Feature> {
  const url = getMapUrl({ boundaryId, format: "application/vnd.geo+json" });
  const response = await axios.get(url);
  return response.data;
}

interface Props {
  series: SeriesValues[];
  metadata: SeriesMetadata;
  division: DivisionToPlotAsMap;
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

  const { isLoading: isLoadingDivisionsNames, data: divisionsNames } = useQuery<
    DivisionMetadata[]
  >(
    ["Fetch geographic division names", division],
    () => fetchDivisionNames(division),
    { enabled: Boolean(division) }
  );

  const { isLoading: isLoadingOutlineMap, data: outline } = useQuery<Feature>(
    ["Fetch outline map given a boundary region id", boundaryId],
    () => getOutlineMap(boundaryId)
  );

  const divisionsNamesById = divisionsNames && keyBy(divisionsNames, "id");

  const seriesByDate = groupBy(series, row =>
    formatDate(new Date(row.VALDATA), { periodicity: metadata.PERNOME })
  );

  const dates = Object.keys(seriesByDate);

  const [selectedDate, setSelectedDate] = React.useState(() => dates[0]);

  const selectedDateRows = seriesByDate[selectedDate] || {};
  const selectedDateValues = Object.values(selectedDateRows).map(
    row => row["VALVALOR"]
  );

  const scale = scaleQuantile<string>()
    .domain(selectedDateValues)
    .range(palette[4]);

  const isLoading = isLoadingOutlineMap || isLoadingDivisionsNames;

  return (
    <>
      {isLoading ? (
        <ChartLoading />
      ) : (
        <MapWrapper
          scale={scale}
          metadata={metadata}
          outline={outline!}
          title={`${metadata.SERNOME} - ${selectedDate}`}
        >
          <Geographies geography={getMapUrl({ boundaryId, division })}>
            {({ geographies }) =>
              geographies.map(geo => {
                const divisionId = geo.properties.codarea;

                // FIXME: probably a bug
                const name = divisionsNamesById?.[divisionId]?.["nome"];

                const currentRow = selectedDateRows.find(
                  row => row["TERCODIGO"] === divisionId
                );

                const value = (currentRow && currentRow["VALVALOR"]) || 0;

                return (
                  <Geography
                    key={divisionId}
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
        date={selectedDate}
        dates={dates}
        handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSelectedDate(e.target.value)
        }
      />
    </>
  );
});
