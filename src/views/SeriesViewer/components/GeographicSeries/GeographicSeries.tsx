import { BoundaryDivision, GeographicDivision, shouldPlotMap } from "api/ibge";
import { fetchGeographicDivisions, fetchGeographicValues } from "api/ipea";
import {
  Loading,
  SeriesChart,
  SeriesDateInputs,
  SeriesDateInputsData,
  SeriesFilters,
} from "components";
import { useSyncSearchParams } from "hooks";
import * as React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { SeriesMetadata } from "types";
import {
  getBoundaryDivisionSafely,
  getDateSafely,
  getDivisionSafely,
} from "utils";
import {
  GeographicLineChart,
  GeographicMap,
  GeographyInputs,
  GeographyInputsData,
} from "./components";

const DEFAULT_LAST_N = 5;
const DEFAULT_BOUNDARY_ID = "BR";

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function GeographicSeries({ code, metadata }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [startDate, setStartDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("startDate"))
  );

  const [endDate, setEndDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("endDate"))
  );

  const [lastN, setLastN] = React.useState(
    Number(searchParams.get("lastN")) || DEFAULT_LAST_N
  );

  const [division, setDivision] = React.useState<GeographicDivision | null>(
    getDivisionSafely(searchParams.get("division"))
  );

  const [boundaryDivision, setBoundaryDivision] =
    React.useState<BoundaryDivision | null>(
      getBoundaryDivisionSafely(searchParams.get("boundaryDivision"))
    );

  const [boundaryId, setBoundaryId] = React.useState<string>(
    searchParams.get("boundaryId") || DEFAULT_BOUNDARY_ID
  );

  const {
    isError: isErrorDivisions,
    isLoading: isLoadingDivisions,
    data: divisions = [],
  } = useQuery<GeographicDivision[]>(
    ["Fetch available geographic divisions", code],
    () => fetchGeographicDivisions(code),
    {
      onSuccess: ([firstDivision]) =>
        setDivision((division) => division || firstDivision || null),
    }
  );

  const {
    isError: isErrorData,
    isLoading: isLoadingData,
    data,
  } = useQuery(
    [code, startDate, endDate, lastN, division, boundaryId],
    () =>
      fetchGeographicValues({
        code,
        startDate,
        endDate,
        lastN,
        division: division!,
        boundaryId,
        metadata,
      }),
    { enabled: Boolean(division) }
  );

  const series = data?.value || [];

  const isLoading = isLoadingData || isLoadingDivisions;
  const isError = isErrorData || isErrorDivisions;

  const onSubmit = (data: SeriesDateInputsData & GeographyInputsData) => {
    const {
      startDate,
      endDate,
      lastN,
      division = null,
      boundaryDivision = null,
      boundaryId = DEFAULT_BOUNDARY_ID,
    } = data;

    setStartDate(startDate);
    setEndDate(endDate);
    setLastN(lastN !== "" ? Number(lastN) : DEFAULT_LAST_N);
    setDivision(division);
    setBoundaryDivision(boundaryDivision);
    setBoundaryId(boundaryId);
  };

  const stateToSync = React.useMemo(
    () => ({
      startDate,
      endDate,
      lastN: lastN !== DEFAULT_LAST_N ? lastN : null,
      division,
      boundaryDivision,
      boundaryId: boundaryId !== DEFAULT_BOUNDARY_ID ? boundaryId : null,
    }),
    [startDate, endDate, lastN, division, boundaryDivision, boundaryId]
  );

  useSyncSearchParams(stateToSync);

  return (
    <>
      <SeriesFilters
        metadata={metadata}
        onSubmit={onSubmit}
        defaultValues={{
          startDate,
          endDate,
          lastN,
        }}
      >
        <SeriesDateInputs metadata={metadata} />

        {isLoadingDivisions ? (
          <Loading />
        ) : (
          !isErrorDivisions &&
          division !== null && (
            <GeographyInputs
              division={division}
              boundaryDivision={boundaryDivision}
              boundaryId={boundaryId}
              divisions={divisions}
            />
          )
        )}
      </SeriesFilters>

      <SeriesChart
        isLoading={isLoading}
        isError={isError}
        isEmpty={series.length === 0}
      >
        {shouldPlotMap(division!) ? (
          <GeographicMap
            series={series}
            metadata={metadata}
            division={division}
            boundaryId={boundaryId}
          />
        ) : (
          <GeographicLineChart series={series} metadata={metadata} />
        )}
      </SeriesChart>
    </>
  );
}
