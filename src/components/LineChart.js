import React, { useState, useEffect } from "react";

import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";

import LineChartForm from "./LineChartForm";
import TimeseriesChart from "./TimeseriesChart";

export default function LineChart({ code, metadata }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    let url = buildSeriesUrl(code);

    fetch(limitQuery(url, 50))
      .then(response => response.json())
      .then(json => setSeries(json.value));
  }, [code]);

  const labels = series.map(series => series.VALDATA);
  const datasets = [{
    label: code,
    data: series.map(series => series.VALVALOR)
  }];

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    let url;
    const baseUrl = buildSeriesUrl(code);

    if (lastN.value) {
      url = limitQuery(baseUrl, lastN.value);
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
    <>
      <LineChartForm metadata={metadata} onSubmit={handleSubmit} />

      <TimeseriesChart
        labels={labels}
        datasets={datasets}
        metadata={metadata}
      />
    </>
  );
}
