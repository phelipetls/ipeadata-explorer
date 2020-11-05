import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartSection } from "./ChartSection";
import { ChartContainer } from "./ChartContainer";
import { ChartTimeseries } from "./ChartTimeseries";

import { buildSeriesUrl, getDateFilter } from "../api/odata";

const DEFAULT_OFFSET = 50;

export function ChartMacro({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_OFFSET);

  const { isLoading, data } = useQuery(
    [code, initialDate, finalDate, lastN],
    async () => {
      const dateFilter = getDateFilter(initialDate, finalDate, lastN, metadata);

      const url = buildSeriesUrl(code) + "&$filter=" + dateFilter;
      return await (await fetch(url)).json();
    }
  );

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate.value) setInitialDate(initialDate.value);
    if (finalDate.value) setFinalDate(finalDate.value);
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
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      <ChartContainer isLoading={isLoading} data={series}>
        <ChartTimeseries
          metadata={metadata}
          labels={labels}
          datasets={datasets}
        />
      </ChartContainer>
    </ChartSection>
  );
}
