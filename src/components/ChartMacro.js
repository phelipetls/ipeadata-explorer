import React, { useState, useEffect } from "react";

import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

import ChartForm from "./ChartForm";
import ChartFormDates from "./ChartFormDates";
import ChartFormTopN from "./ChartFormTopN";
import ChartSection from "./ChartSection";
import ChartTimeseries from "./ChartTimeseries";

export default function ChartMacro({ code, metadata }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    let url = buildSeriesUrl(code);

    fetch(limitQuery(url, 50))
      .then(response => response.json())
      .then(json => setSeries(json.value));
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
        <ChartFormDates metadata={metadata} />
        <ChartFormTopN />
      </ChartForm>

      <ChartTimeseries
        labels={labels}
        datasets={datasets}
        metadata={metadata}
      />
    </ChartSection>
  );
}
