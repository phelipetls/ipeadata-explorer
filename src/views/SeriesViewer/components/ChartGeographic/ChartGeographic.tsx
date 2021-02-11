import * as React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import {
  GeographicMap,
  GeographyInputs,
  GeographyInputsData,
  GeographicLineChart,
} from "./components";
import {
  Loading,
  ChartLoading,
  ChartEmpty,
  ChartFilters,
  ChartDateInputs,
  ChartDateInputsData,
  ChartSection,
} from "components";
import { SeriesMetadata } from "types";

import {
  buildSeriesValuesUrl,
  getDateFilter,
  buildFilter,
  buildGeographicDivisionsUrl,
} from "api/odata";
import { SeriesDivision, shouldPlotMap } from "api/ibge";
import { getDateSafely, getDivisionSafely } from "utils";
import { useSyncSearchParams } from "hooks";

const DEFAULT_LIMIT = 5;
const DEFAULT_BOUNDARY = "BR";

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
  if (!shouldPlotMap(division) || boundaryId === DEFAULT_BOUNDARY) return "";
  return `startswith(TERCODIGO,'${String(boundaryId).slice(0, 2)}')`;
}

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartGeographic({ code, metadata }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [startDate, setStartDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("startDate"))
  );

  const [endDate, setEndDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("endDate"))
  );

  const [lastN, setLastN] = React.useState(
    Number(searchParams.get("lastN")) || DEFAULT_LIMIT
  );

  const [division, setDivision] = React.useState<SeriesDivision | null>(
    getDivisionSafely(searchParams.get("division"))
  );

  const [boundaryId, setBoundaryId] = React.useState(DEFAULT_BOUNDARY);

  const stateToSync = React.useMemo(
    () => ({
      startDate,
      endDate,
      lastN: lastN !== DEFAULT_LIMIT ? lastN : null,
      division,
    }),
    [startDate, endDate, lastN, division]
  );

  useSyncSearchParams(stateToSync);

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

  function onSubmit(data: ChartDateInputsData & GeographyInputsData) {
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
      <ChartFilters
        onSubmit={onSubmit}
        defaultValues={{
          startDate,
          endDate,
          lastN,
        }}
      >
        <ChartDateInputs metadata={metadata} />
        {isLoadingDivisions || division === null ? (
          <Loading />
        ) : (
          <GeographyInputs division={division} divisions={divisions} />
        )}
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : series.length === 0 ? (
        <ChartEmpty text="Sem dados" />
      ) : division && shouldPlotMap(division) ? (
        <GeographicMap
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
