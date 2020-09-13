import React, { useState, useEffect } from "react";
import groupBy from "lodash.groupby";

import { buildSeriesUrl, buildGeographicLevelsUrl } from "../api/odata";

import ChartForm from "./ChartForm";
import ChartFormDates from "./ChartFormDates";
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

      const allGeoLevels = levelsJson.value.map(level => level.NIVNOME);
      setGeoLevels(allGeoLevels);

      const selectedGeoLevel = allGeoLevels[0];

      const seriesUrl =
        buildSeriesUrl(code) + `&$filter=NIVNOME eq '${selectedGeoLevel}'`;

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
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDates metadata={metadata} />
        <ChartFormGeography geoLevels={geoLevels} />
      </ChartForm>

      <ChartTimeseries
        labels={labels}
        datasets={datasets}
        metadata={metadata}
      />
    </ChartSection>
  );
}
