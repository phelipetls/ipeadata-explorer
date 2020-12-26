import React, { useState } from "react";

import { useQuery } from "react-query";

import { Map, GeographyInputs, GeographicLineChart } from "./components";
import {
  Loading,
  ChartLoading,
  ChartNoData,
  ChartFilters,
  DateInputs,
  ChartSection,
} from "components/common";
import { SeriesMetadata } from "components/types";

import {
  buildSeriesValuesUrl,
  getDateFilter,
  buildFilter,
  buildGeographicDivisionsUrl,
} from "api/odata";
import { SeriesDivision, shouldPlotMap } from "api/ibge";

const DEFAULT_LIMIT = 5;

interface GeographicDivisionMetadata {
  value: {
    NIVNOME: SeriesDivision;
    Count: number;
  }[];
}

async function fetchGeographicDivisions(
  _: string,
  code: string
): Promise<SeriesDivision[]> {
  const url = buildGeographicDivisionsUrl(code);
  const json: GeographicDivisionMetadata = await (await fetch(url)).json();
  return json.value.map(division => division.NIVNOME);
}

function getBoundaryFilter(boundaryId: string, division: SeriesDivision) {
  if (!shouldPlotMap(division) || boundaryId === "BR") return "";
  return `startswith(TERCODIGO,'${String(boundaryId).slice(0, 2)}')`;
}

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartGeographic({ code, metadata }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const [division, setDivision] = useState<SeriesDivision | null>(null);
  const [boundaryId, setBoundaryId] = useState("BR");

  const { isLoading: isLoadingDivisions, data: divisions = [] } = useQuery<
    SeriesDivision[]
  >(["Fetch available geographic divisions", code], fetchGeographicDivisions, {
    onSuccess: ([firstDivision]) => setDivision(firstDivision),
  });

  const { isLoading: isLoadingData, data = {} } = useQuery(
    [code, startDate, endDate, lastN, division, boundaryId],
    async () => {
      const dateFilter = getDateFilter({
        start: startDate,
        end: endDate,
        lastN,
        metadata,
      });
      const boundaryFilter = getBoundaryFilter(boundaryId, division!);
      const divisionFilter = `NIVNOME eq '${division}'`;

      const url =
        buildSeriesValuesUrl(code) +
        buildFilter(dateFilter, divisionFilter, boundaryFilter);

      return await (await fetch(url)).json();
    },
    { enabled: division }
  );

  function onSubmit(data: Record<string, any>) {
    const { startDate, endDate, lastN, division, boundaryId } = data;

    if (startDate) setStartDate(startDate);
    if (endDate) setEndDate(endDate);
    if (lastN) setLastN(lastN);
    if (division) setDivision(division);
    if (boundaryId) setBoundaryId(boundaryId);
  }

  const isLoading = isLoadingData || isLoadingDivisions;

  const series = (data && data.value) || [];

  return (
    <ChartSection>
      <ChartFilters onSubmit={onSubmit}>
        <DateInputs metadata={metadata} />
        {isLoadingDivisions ? (
          <Loading />
        ) : (
          <GeographyInputs division={division!} divisions={divisions} />
        )}
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : series.length === 0 ? (
        <ChartNoData />
      ) : division && shouldPlotMap(division) ? (
        <Map
          series={series}
          metadata={metadata}
          division={division}
          boundaryId={boundaryId}
        />
      ) : (
        <GeographicLineChart series={series} metadata={metadata} />
      )}
    </ChartSection>
  );
}
