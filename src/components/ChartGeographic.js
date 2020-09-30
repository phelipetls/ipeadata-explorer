import React, { useState, useEffect } from "react";

import { useTheme } from "@material-ui/styles";

import {
  buildSeriesUrl,
  buildGeographicLevelsUrl,
  limitQuery,
  limitByDate,
} from "../api/odata";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartFormTimeInterval from "./ChartFormTimeInterval";
import ChartFormGeography from "./ChartFormGeography";
import ChartSection from "./ChartSection";
import ChartGeographicMap from "./ChartGeographicMap";
import ChartGeographicTimeseries from "./ChartGeographicTimeseries";

export default function ChartGeographic({ code, metadata }) {
  const theme = useTheme();

  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [geoDivision, setGeoDivision] = useState("");
  const [geoDivisions, setGeoDivisions] = useState([]);

  useEffect(() => {
    async function fetchGeographicLevels() {
      const url = buildGeographicLevelsUrl(code);
      const response = await fetch(url);
      const json = await response.json();
      return json.value;
    }
  const chartType =
    geoDivision === "Brasil" ||
    geoDivision === "Regiões" ||
    geoDivision === "Área metropolitana"
      ? "line"
      : "map";

    async function fetchSeries() {
      const allGeoLevels = await fetchGeographicLevels();
      setGeoLevels(allGeoLevels);

      const selectedGeoDivision = availableGeoDivisions[0];
      setGeoDivision(selectedGeoDivision.NIVNOME);

      const seriesUrl =
        buildSeriesUrl(code) +
        `&$filter=NIVNOME eq '${selectedGeoDivision.NIVNOME}'` +
        `&$top=${selectedGeoDivision.regionCount * 25}`;

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

    const { initialDate, finalDate, topN, geoDivision } = e.target.elements;
    setGeoDivision(geoDivision.value);

    const selectedGeoDivision = geoDivisions.find(
      level => level.NIVNOME === geoDivision.value
    );

    const baseUrl =
      buildSeriesUrl(code) +
      `&$filter=NIVNOME eq '${selectedGeoDivision.NIVNOME}'`;

    let url;
    if (topN.value) {
      url = limitQuery(baseUrl, topN.value * selectedGeoDivision.regionCount);
    } else if (initialDate.value || finalDate.value) {
      url = limitByDate(baseUrl, initialDate.value, finalDate.value);
    } else {
      url = limitQuery(baseUrl, 25 * selectedGeoDivision.regionCount);
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
        {!geoDivision ? (
          <Loading />
        ) : (
          <ChartFormGeography
            geoDivision={geoDivision}
            geoDivisions={geoDivisions.map(level => level.NIVNOME)}
          />
        )}
      </ChartForm>

      {isLoading ? (
        <Loading style={{ minHeight: theme.chart.minHeight }} />
      ) : chartType === "line" ? (
        <ChartGeographicTimeseries series={series} metadata={metadata} />
      ) : (
        <ChartGeographicMap
          series={series}
          metadata={metadata}
          geoDivision={geoDivision}
        />
      )}
    </ChartSection>
  );
}
