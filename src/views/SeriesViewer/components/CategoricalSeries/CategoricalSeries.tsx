import { fetchCategoricalValues } from "api/ipea";
import {
  SeriesChart,
  SeriesDateInputs,
  SeriesDateInputsData,
  SeriesFilters,
} from "components";
import { useSyncSearchParams } from "hooks";
import * as React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import { SeriesMetadata } from "types";
import { getDateSafely } from "utils";
import { CategoricalBarChart } from "./components";

export const DEFAULT_LAST_N = 1;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function CategoricalSeries({ code, metadata }: Props) {
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

  const { isError, isLoading, data } = useQuery(
    [code, startDate, endDate, lastN],
    () => fetchCategoricalValues({ code, startDate, endDate, lastN, metadata })
  );

  const categories = data?.value || [];

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
        defaultValues={{
          startDate,
          endDate,
          lastN,
        }}
        onSubmit={onSubmit}
      >
        <SeriesDateInputs metadata={metadata} />
      </SeriesFilters>

      <SeriesChart
        isLoading={isLoading}
        isError={isError}
        isEmpty={categories.length === 0}
      >
        <CategoricalBarChart categories={categories} metadata={metadata} />
      </SeriesChart>
    </>
  );
}
