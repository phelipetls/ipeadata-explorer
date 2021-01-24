import * as React from "react";

import { useQuery } from "react-query";

import {
  GeographicMap,
  GeographyInputs,
  GeographyInputsData,
  GeographicLineChart,
} from "./components";
import {
  Loading,
  ChartLoading,
  ChartNoData,
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
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [lastN, setLastN] = React.useState(DEFAULT_LIMIT);

  const [division, setDivision] = React.useState<SeriesDivision | null>(null);
  const [boundaryId, setBoundaryId] = React.useState("BR");

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
      <ChartFilters onSubmit={onSubmit}>
        <ChartDateInputs metadata={metadata} />
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