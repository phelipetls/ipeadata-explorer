import * as React from "react";

import { useQuery } from "react-query";

import {
  ChartFilters,
  ChartDateInputs,
  ChartSection,
  LineChart,
  ChartLoading,
  ChartNoData,
} from "components";
import { SeriesMetadata, SeriesValues } from "types";
import { buildSeriesValuesUrl, getDateFilter, buildFilter } from "api/odata";

const DEFAULT_LIMIT = 50;

interface Props {
  code: string;
  metadata: SeriesMetadata;
}

export function ChartMacro({ code, metadata }: Props) {
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
      const url = buildSeriesValuesUrl(code) + buildFilter(dateFilter);
      return await (await fetch(url)).json();
    }
  );

  function onSubmit(data: Record<string, any>) {
    const { startDate, endDate, lastN } = data;

    if (startDate) setStartDate(startDate);
    if (endDate) setEndDate(endDate);
    if (lastN) setLastN(lastN);
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
      <ChartFilters onSubmit={onSubmit}>
        <ChartDateInputs metadata={metadata} />
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : series.length === 0 ? (
        <ChartNoData />
      ) : (
        <LineChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
