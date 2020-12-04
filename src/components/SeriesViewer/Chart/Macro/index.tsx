import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartFilters } from "../ChartFilters";
import { DateInputs } from "../DateInputs";
import { ChartSection } from "../ChartSection";
import { LineChart } from "../LineChart";
import { ChartLoading } from "../ChartLoading";
import { ChartNoData } from "../ChartNoData";

import { buildSeriesValuesUrl, getDateFilter, buildFilter } from "../../../api/odata";

const DEFAULT_LIMIT = 50;

export function ChartMacro({ code, metadata }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

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

  function handleSubmit(e) {
    e.preventDefault();

    const { startDate, endDate, lastN } = e.target.elements;

    if (startDate.value) setStartDate(startDate.value);
    if (endDate.value) setEndDate(endDate.value);
    if (lastN.value) setLastN(lastN.value);
  }

  const series = (data && data.value) || [];

  const labels = series.map(series => series.VALDATA);
  const datasets = [
    {
      label: code,
      data: series.map(series => series.VALVALOR),
    },
  ];

  return (
    <ChartSection>
      <ChartFilters onSubmit={handleSubmit}>
        <DateInputs metadata={metadata} />
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
