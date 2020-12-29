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

const DEFAULT_LIMIT = 1;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartCategorical({ code, metadata }: Props) {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [lastN, setLastN] = React.useState(DEFAULT_LIMIT);

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
    let { startDate, endDate, lastN } = data;

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
      <ChartFilters onSubmit={onSubmit}>
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
