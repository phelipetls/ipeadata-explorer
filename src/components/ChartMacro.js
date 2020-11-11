import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartSection } from "./ChartSection";
import { ChartTimeseries } from "./ChartTimeseries";
import { ChartLoading } from "./ChartLoading";
import { ChartNoData } from "./ChartNoData";

import { buildSeriesUrl, getDateFilter } from "../api/odata";

const DEFAULT_LIMIT = 50;

export function ChartMacro({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

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

      {isLoading ? (
        <ChartLoading />
      ) : series.length === 0 ? (
        <ChartNoData />
      ) : (
        <ChartTimeseries
          metadata={metadata}
          labels={labels}
          datasets={datasets}
        />
      )}
    </ChartSection>
  );
}
