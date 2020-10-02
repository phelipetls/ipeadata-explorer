import React, { useState, useEffect } from "react";

import { useTheme } from "@material-ui/styles";
import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartContainer from "./ChartContainer";
import ChartFormTimeInterval from "./ChartFormTimeInterval";
import ChartSection from "./ChartSection";
import ChartTimeseries from "./ChartTimeseries";

const DEFAULT_LIMIT = 50;

export default function ChartMacro({ code, metadata }) {
  const theme = useTheme();

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

    const { initialDate, finalDate, topN } = e.target.elements;

    const dateFilter =
      initialDate.value || finalDate.value
        ? `&$filter=${limitByDate(initialDate.value, finalDate.value)}`
        : limitQuery(topN.value);

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
        <ChartFormTimeInterval metadata={metadata} />
      </ChartForm>

      {isLoading ? (
        <Loading style={{ minHeight: theme.chart.minHeight }} />
      ) : (
        <ChartContainer>
          <ChartTimeseries
            labels={labels}
            datasets={datasets}
            metadata={metadata}
          />
        </ChartContainer>
      )}
    </ChartSection>
  );
}
