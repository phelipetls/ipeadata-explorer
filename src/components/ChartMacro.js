import React, { useState, useEffect } from "react";

import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartContainer from "./ChartContainer";
import ChartFormTimeInterval from "./ChartFormTimeInterval";
import ChartSection from "./ChartSection";
import ChartTimeseries from "./ChartTimeseries";

export default function ChartMacro({ code, metadata }) {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let url = buildSeriesUrl(code);

    setIsLoading(true);
    fetch(limitQuery(url, 50))
      .then(response => response.json())
      .then(json => setSeries(json.value))
      .then(() => setIsLoading(false));
  }, [code]);

  const labels = series.map(series => series.VALDATA);
  const datasets = [
    {
      label: code,
      data: series.map(series => series.VALVALOR)
    }
  ];

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, topN } = e.target.elements;

    let url;
    const baseUrl = buildSeriesUrl(code);

    if (topN.value) {
      url = limitQuery(baseUrl, topN.value);
    } else if (initialDate.value || finalDate.value) {
      url = limitByDate(baseUrl, initialDate.value, finalDate.value);
    } else {
      return;
    }

    fetch(url)
      .then(response => response.json())
      .then(json => setSeries(json.value));
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormTimeInterval metadata={metadata} />
      </ChartForm>

      {isLoading ? (
        <Loading style={{ minHeight: 512 }} />
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
