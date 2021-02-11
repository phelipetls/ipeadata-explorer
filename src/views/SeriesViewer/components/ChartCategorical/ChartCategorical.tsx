import * as React from "react";

import { useQuery } from "react-query";

import {
  ChartLoading,
  ChartEmpty,
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

export const DEFAULT_LIMIT = 1;

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

  const { isLoading, data } = useQuery(
    [code, startDate, endDate, lastN],
    async () => {
      const dateFilter = getDateFilter({
        start: startDate,
        end: endDate,
        lastN,
        metadata,
      });
      const url = buildCountByCategoryUrl(code, { filter: dateFilter });
      return await (await fetch(url)).json();
    }
  );

  async function onSubmit(data: ChartDateInputsData) {
    const { startDate, endDate, lastN } = data;

    if (startDate) setStartDate(startDate);
    if (endDate) setEndDate(endDate);
    if (lastN) setLastN(+lastN);
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
      ) : categories.length === 0 ? (
        <ChartEmpty text="Sem dados" />
      ) : (
        <BarChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
