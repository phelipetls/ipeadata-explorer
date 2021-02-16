import * as React from "react";

import axios from "redaxios";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getDateSafely } from "utils";

import {
  ChartFilters,
  ChartDateInputs,
  ChartSection,
  LineChart,
  ChartLoading,
  ChartError,
  ChartNoData,
  ChartDateInputsData,
} from "components";
import { SeriesMetadata, SeriesValues } from "types";
import { buildSeriesValuesUrl, getDateFilter, buildFilter } from "api/odata";
import { useSyncSearchParams } from "hooks";

const DEFAULT_LIMIT = 50;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartMacro({ code, metadata }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [startDate, setStartDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("startDate"))
  );

  const [endDate, setEndDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("endDate"))
  );

  const [lastN, setLastN] = React.useState<number>(
    Number(searchParams.get("lastN")) || DEFAULT_LIMIT
  );

  const stateToSync = React.useMemo(
    () => ({
      startDate,
      endDate,
      lastN: lastN !== DEFAULT_LIMIT ? lastN : null,
    }),
    [startDate, endDate, lastN]
  );

  useSyncSearchParams(stateToSync);

  const { isLoading, data, isError } = useQuery(
    [code, startDate, endDate, lastN],
    async () => {
      const dateFilter = getDateFilter({
        start: startDate,
        end: endDate,
        lastN,
        metadata,
      });

      const url = buildSeriesValuesUrl(code) + buildFilter(dateFilter);

      const response = await axios.get(url);
      return response.data;
    }
  );

  function onSubmit(data: ChartDateInputsData) {
    const { startDate, endDate, lastN } = data;

    setStartDate(startDate);
    setEndDate(endDate);
    setLastN(lastN !== "" ? Number(lastN) : DEFAULT_LIMIT);
  }

  const series: SeriesValues[] = (data && data.value) || [];

  const labels = series.map(series => series.VALDATA);
  const datasets = [
    {
      label: code,
      data: series.map(series => series.VALVALOR),
    },
  ];

  return (
    <ChartSection>
      <ChartFilters
        onSubmit={onSubmit}
        defaultValues={{ startDate, endDate, lastN }}
      >
        <ChartDateInputs metadata={metadata} />
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : isError ? (
        <ChartError />
      ) : series.length === 0 ? (
        <ChartNoData />
      ) : (
        <LineChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
