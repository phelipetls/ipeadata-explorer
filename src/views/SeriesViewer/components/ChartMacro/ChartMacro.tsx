import * as React from "react";
import { useQuery } from "react-query";
import { useLocation, useHistory } from "react-router-dom";
import { getDateSafely } from "utils";

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
  const location = useLocation();
  const history = useHistory();
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
      ) : series.length === 0 ? (
        <ChartNoData />
      ) : (
        <LineChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
