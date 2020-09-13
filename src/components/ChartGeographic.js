import React, { useState, useEffect } from "react";
import groupBy from "lodash.groupby";

import {
  buildSeriesUrl,
  buildGeographicLevelsUrl,
  limitQuery,
  limitByDate
} from "../api/odata";

import ChartForm from "./ChartForm";
import ChartFormDates from "./ChartFormDates";
import ChartFormTopN from "./ChartFormTopN";
import ChartFormGeography from "./ChartFormGeography";
import ChartSection from "./ChartSection";
import ChartTimeseries from "./ChartTimeseries";

export default function ChartGeographic({ code, metadata }) {
  const [series, setSeries] = useState([]);
  const [geoLevels, setGeoLevels] = useState([]);

  useEffect(() => {
    async function fetchValues() {
      const levelsUrl = buildGeographicLevelsUrl(code);
      const levelsResponse = await fetch(levelsUrl);
      const levelsJson = await levelsResponse.json();

      const allGeoLevels = levelsJson.value;
      setGeoLevels(allGeoLevels);

      const selectedGeoLevel = allGeoLevels[0];

      const seriesUrl =
        buildSeriesUrl(code) +
        `&$filter=NIVNOME eq '${selectedGeoLevel.NIVNOME}'` +
        `&$top=${selectedGeoLevel.distinctCount * 25}`;

      const seriesResponse = await fetch(seriesUrl);
      const seriesJson = await seriesResponse.json();

      setSeries(seriesJson.value);
    }

    fetchValues();
  }, [code]);

  const datasets = Object.entries(groupBy(series, "TERNOME")).map(
    ([level, values]) => ({
      label: level,
      data: values.map(series => series.VALVALOR)
    })
  );

  const labels = Array.from(new Set(series.map(series => series.VALDATA)));

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, topN, geoLevel } = e.target.elements;

    const selectedGeoLevel = geoLevels.find(
      level => level.NIVNOME === geoLevel.value
    );

    const baseUrl =
      buildSeriesUrl(code) +
      `&$filter=NIVNOME eq '${selectedGeoLevel.NIVNOME}'`;

    let url;
    if (topN.value) {
      url = limitQuery(baseUrl, topN.value * selectedGeoLevel.distinctCount);
    } else if (initialDate.value || finalDate.value) {
      url = limitByDate(baseUrl, initialDate.value, finalDate.value);
    } else {
      url = limitQuery(baseUrl, 25 * selectedGeoLevel.distinctCount);
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
        <ChartFormGeography geoLevels={geoLevels.map(level => level.NIVNOME)} />
      </ChartForm>

      <ChartTimeseries
        labels={labels}
        datasets={datasets}
        metadata={metadata}
      />
    </ChartSection>
  );
}
