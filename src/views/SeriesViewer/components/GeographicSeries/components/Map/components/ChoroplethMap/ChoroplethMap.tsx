import {
  DivisionToPlotAsMap,
  fetchDivisionTerritories,
  getMapUrl,
} from "api/ibge";
import { fetchMap } from "api/ibge/requests";
import { ChartLoading } from "components";
import { scaleQuantile } from "d3-scale";
import { schemeBlues as palette } from "d3-scale-chromatic";
import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";
import * as React from "react";
import { useQuery } from "react-query";
import { Geographies, Geography } from "react-simple-maps";
import { SeriesMetadata, SeriesValuesGeographic } from "types";
import { formatDate } from "utils";
import { MapWrapper, SelectDate } from "./components";

interface Props {
  series: SeriesValuesGeographic[];
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

  const { isLoading: isLoadingTerritories, data: territories } = useQuery(
    ["Fetch division territories", division],
    () => fetchDivisionTerritories(division),
    { enabled: Boolean(division) }
  );

  const territoriesByDivisionId = territories && keyBy(territories, "id");

  const { isLoading: isLoadingOutlineMap, data: outline } = useQuery(
    ["Fetch outline map given a boundary region id", boundaryId],
    () => fetchMap(boundaryId)
  );

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

  const isLoading = isLoadingOutlineMap || isLoadingTerritories;

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
          <Geographies geography={getMapUrl({ id: boundaryId, division })}>
            {({ geographies }) =>
              geographies.map(geo => {
                const divisionId = geo.properties.codarea;

                // FIXME: probably a bug
                const name = territoriesByDivisionId?.[divisionId]?.["nome"];

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
