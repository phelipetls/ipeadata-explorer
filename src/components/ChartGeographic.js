import React, { useState, useEffect } from "react";

import {
  buildSeriesUrl,
  buildGeographicLevelsUrl,
  limitQuery,
  limitByDate
} from "../api/odata";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartFormTimeInterval from "./ChartFormTimeInterval";
import ChartFormGeography from "./ChartFormGeography";
import ChartSection from "./ChartSection";
import ChartGeographicMap from "./ChartGeographicMap";
import ChartGeographicTimeseries from "./ChartGeographicTimeseries";

export default function ChartGeographic({ code, metadata }) {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [geoLevel, setGeoLevel] = useState("");
  const [geoLevels, setGeoLevels] = useState([]);

  useEffect(() => {
    async function fetchGeographicLevels() {
      const url = buildGeographicLevelsUrl(code);
      const response = await fetch(url);
      const json = await response.json();
      return json.value;
    }

    async function fetchSeries() {
      const allGeoLevels = await fetchGeographicLevels();
      setGeoLevels(allGeoLevels);

      const selectedGeoLevel = allGeoLevels[0];
      setGeoLevel(selectedGeoLevel.NIVNOME);

      const seriesUrl =
        buildSeriesUrl(code) +
        `&$filter=NIVNOME eq '${selectedGeoLevel.NIVNOME}'` +
        `&$top=${selectedGeoLevel.regionCount * 25}`;

      setIsLoading(true);
      const response = await fetch(seriesUrl);
      const json = await response.json();
      setSeries(json.value);
      setIsLoading(false);
    }

    fetchSeries();
  }, [code]);

  async function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, topN, geoLevel } = e.target.elements;
    setGeoLevel(geoLevel.value);

    const selectedGeoLevel = geoLevels.find(
      level => level.NIVNOME === geoLevel.value
    );

    const baseUrl =
      buildSeriesUrl(code) +
      `&$filter=NIVNOME eq '${selectedGeoLevel.NIVNOME}'`;

    let url;
    if (topN.value) {
      url = limitQuery(baseUrl, topN.value * selectedGeoLevel.regionCount);
    } else if (initialDate.value || finalDate.value) {
      url = limitByDate(baseUrl, initialDate.value, finalDate.value);
    } else {
      url = limitQuery(baseUrl, 25 * selectedGeoLevel.regionCount);
    }

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
        {!geoLevel ? (
          <Loading />
        ) : (
          <ChartFormGeography
            geoLevel={geoLevel}
            geoLevels={geoLevels.map(level => level.NIVNOME)}
          />
        )}
      </ChartForm>

      {isLoading ? (
        <Loading style={{ minHeight: 512 }} />
      ) : geoLevel === "Brasil" ||
        geoLevel === "Regiões" ||
        geoLevel === "Área metropolitana" ? (
        <ChartGeographicTimeseries series={series} metadata={metadata} />
      ) : (
        <ChartGeographicMap
          series={series}
          metadata={metadata}
          geoLevel={geoLevel}
        />
      )}
    </ChartSection>
  );
}
