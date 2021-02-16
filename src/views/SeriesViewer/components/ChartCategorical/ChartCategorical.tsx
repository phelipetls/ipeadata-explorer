import * as React from "react";

import axios from "redaxios";
import { useQuery } from "react-query";

import {
  ChartLoading,
  ChartError,
  ChartNoData,
  ChartSection,
  ChartFilters,
  ChartDateInputs,
  ChartDateInputsData,
  BarChart,
} from "components";
import { SeriesMetadata } from "types";
import {
  buildCountByCategoryUrl,
  CategoriesMetadata,
  getDateFilter,
} from "api/odata";
import { useLocation } from "react-router";
import { getDateSafely } from "utils";
import { useSyncSearchParams } from "hooks";

export const DEFAULT_LAST_N = 1;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartCategorical({ code, metadata }: Props) {
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

  const stateToSync = React.useMemo(
    () => ({
      startDate,
      endDate,
      lastN: lastN !== DEFAULT_LAST_N ? lastN : null,
    }),
    [startDate, endDate, lastN]
  );

  useSyncSearchParams(stateToSync);

  const { isError, isLoading, data } = useQuery(
    [code, startDate, endDate, lastN],
    async () => {
      const dateFilter = getDateFilter({
        start: startDate,
        end: endDate,
        lastN,
        metadata,
      });
      const url = buildCountByCategoryUrl(code, { filter: dateFilter });

      const response = await axios.get(url);
      return response.data;
    }
  );

  async function onSubmit(data: ChartDateInputsData) {
    const { startDate, endDate, lastN } = data;

    setStartDate(startDate);
    setEndDate(endDate);
    setLastN(lastN !== "" ? Number(lastN) : DEFAULT_LAST_N);
  }

  const categories: CategoriesMetadata[] = (data && data.value) || [];

  const labels = categories.map(category => category.VALVALOR);
  const datasets = [
    {
      label: metadata.UNINOME,
      data: categories.map(category => category.count),
    },
  ];

  return (
    <ChartSection>
      <ChartFilters
        defaultValues={{
          startDate,
          endDate,
          lastN,
        }}
        onSubmit={onSubmit}
      >
        <ChartDateInputs metadata={metadata} />
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : isError ? (
        <ChartError />
      ) : categories.length === 0 ? (
        <ChartNoData />
      ) : (
        <BarChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
