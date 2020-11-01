import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartSection } from "./ChartSection";
import { ChartTimeseries } from "./ChartTimeseries";
import { ChartWrapper } from "./ChartWrapper";

import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";
import { formatDateFromDatePicker } from "../api/utils";

const DEFAULT_LIMIT = 50;

export function ChartMacro({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const { isLoading, data } = useQuery(
    [code, initialDate, finalDate, lastN],
    async (code, initialDate, finalDate, lastN) => {
      let dateInterval = "";

      if (initialDate || finalDate) {
        const initialDateValue = formatDateFromDatePicker(initialDate);
        const finalDateValue = formatDateFromDatePicker(finalDate);

        dateInterval = `&$filter=${limitByDate(
          initialDateValue,
          finalDateValue
        )}`;
      } else {
        dateInterval = limitQuery(lastN);
      }

      const url = buildSeriesUrl(code) + dateInterval;

      return await (await fetch(url)).json();
    }
  );

  const series = data?.value || [];

  async function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
  }

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
