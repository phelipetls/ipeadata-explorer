import * as React from "react";

import { useQuery } from "react-query";

import {
  ChartLoading,
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
import { useHistory, useLocation } from "react-router";
import { getDateSafely } from "utils";

export const DEFAULT_LIMIT = 1;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartCategorical({ code, metadata }: Props) {
  const location = useLocation();
  const history = useHistory();
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

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams();

    if (startDate) {
      newSearchParams.set("startDate", startDate.toLocaleDateString("pt-BR"));
    }

    if (endDate) {
      newSearchParams.set("endDate", endDate.toLocaleDateString("pt-BR"));
    }

    if (lastN !== DEFAULT_LIMIT) {
      newSearchParams.set("lastN", String(lastN));
    }

    history.push({ search: `?${newSearchParams}` });
  }, [startDate, endDate, lastN, history]);

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
        <ChartNoData />
      ) : (
        <BarChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
