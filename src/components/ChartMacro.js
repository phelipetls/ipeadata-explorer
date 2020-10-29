import React, { useState, useEffect } from "react";

import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartSection } from "./ChartSection";
import { ChartTimeseries } from "./ChartTimeseries";
import { ChartWrapper } from "./ChartWrapper";

import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";
import { formatDateFromDatePicker } from "../api/utils";

const DEFAULT_LIMIT = 50;

export function ChartMacro({ code, metadata }) {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      setIsLoading(true);

      const url = buildSeriesUrl(code) + limitQuery(DEFAULT_LIMIT);
      const response = await fetch(url);
      const json = await response.json();
      setSeries(json.value);

      setIsLoading(false);
    }

    fetchSeries();
  }, [code]);

  const labels = series.map(series => series.VALDATA);
  const datasets = [
    {
      label: code,
      data: series.map(series => series.VALVALOR),
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    const initialDateValue = formatDateFromDatePicker(initialDate.value);
    const finalDateValue = formatDateFromDatePicker(finalDate.value);

    const dateFilter =
      initialDate.value || finalDate.value
        ? `&$filter=${limitByDate(initialDateValue, finalDateValue)}`
        : limitQuery(lastN.value || DEFAULT_LIMIT);

    const url = buildSeriesUrl(code) + dateFilter;

    setIsLoading(true);

    const response = await fetch(url);
    const json = await response.json();
    setSeries(json.value);

    setIsLoading(false);
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      <ChartWrapper isLoading={isLoading} series={series}>
        <ChartTimeseries
          labels={labels}
          datasets={datasets}
          metadata={metadata}
        />
      </ChartWrapper>
    </ChartSection>
  );
}
