import { buildFilter, buildSeriesValuesUrl, getDateFilter } from "api/ipea";
import {
  SeriesDateInputs,
  SeriesDateInputsData,
  SeriesFilters,
  SeriesChart,
} from "components";
import { useSyncSearchParams } from "hooks";
import * as React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import axios from "redaxios";
import { SeriesMetadata, SeriesValues } from "types";
import { getDateSafely } from "utils";
import { MacroLineChart } from "./components";

const DEFAULT_LAST_N = 50;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function MacroSeries({ code, metadata }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [startDate, setStartDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("startDate"))
  );

  const [endDate, setEndDate] = React.useState<Date | null>(
    getDateSafely(searchParams.get("endDate"))
  );

  const [lastN, setLastN] = React.useState<number>(
    Number(searchParams.get("lastN")) || DEFAULT_LAST_N
  );

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

  const series: SeriesValues[] = data?.value || [];

  const onSubmit = (data: SeriesDateInputsData) => {
    const { startDate, endDate, lastN } = data;

    setStartDate(startDate);
    setEndDate(endDate);
    setLastN(lastN !== "" ? Number(lastN) : DEFAULT_LAST_N);
  };

  const stateToSync = React.useMemo(
    () => ({
      startDate,
      endDate,
      lastN: lastN !== DEFAULT_LAST_N ? lastN : null,
    }),
    [startDate, endDate, lastN]
  );

  useSyncSearchParams(stateToSync);

  return (
    <>
      <SeriesFilters
        metadata={metadata}
        onSubmit={onSubmit}
        defaultValues={{ startDate, endDate, lastN }}
      >
        <SeriesDateInputs metadata={metadata} />
      </SeriesFilters>

      <SeriesChart
        isLoading={isLoading}
        isError={isError}
        isEmpty={series.length === 0}
      >
        <MacroLineChart metadata={metadata} series={series} />
      </SeriesChart>
    </>
  );
}
