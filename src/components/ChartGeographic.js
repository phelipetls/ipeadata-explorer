import React, { useState, useEffect } from "react";

import { useTheme } from "@material-ui/styles";

import {
  buildSeriesUrl,
  fetchGeographicDivisions,
  limitQuery,
  limitByDate,
} from "../api/odata";

import { getChartType } from "../api/ibge";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartFormTimeInterval from "./ChartFormTimeInterval";
import ChartFormGeography from "./ChartFormGeography";
import ChartSection from "./ChartSection";
import ChartGeographicMap from "./ChartGeographicMap";
import ChartGeographicTimeseries from "./ChartGeographicTimeseries";

const DEFAULT_LIMIT = 5;

export default function ChartGeographic({ code, metadata }) {
  const theme = useTheme();

  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [geoDivision, setGeoDivision] = useState("");
  const [geoDivisions, setGeoDivisions] = useState([]);
  const [geoBoundaryValue, setGeoBundaryValue] = useState("BR");

  useEffect(() => {
    async function fetchSeries() {
      const availableGeoDivisions = await fetchGeographicDivisions(code);
      setGeoDivisions(availableGeoDivisions);

      const selectedGeoDivision = availableGeoDivisions[0];
      setGeoDivision(selectedGeoDivision.NIVNOME);

      const seriesUrl =
        buildSeriesUrl(code) +
        `&$filter=NIVNOME eq '${selectedGeoDivision.NIVNOME}'` +
        `&$top=${selectedGeoDivision.regionCount * DEFAULT_LIMIT}`;

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

    const {
      initialDate,
      finalDate,
      topN,
      geoDivision,
      geoBoundaryValue,
    } = e.target.elements;

    const newGeoDivision = geoDivision.value;
    const newGeoBoundaryValue = geoBoundaryValue ? geoBoundaryValue.value : "BR";

    setGeoDivision(newGeoDivision);
    setGeoBundaryValue(newGeoBoundaryValue);

    const selectedGeoDivision = geoDivisions.find(
      level => level.NIVNOME === newGeoDivision
    );

    const baseUrl =
      buildSeriesUrl(code) +
      `&$filter=NIVNOME eq '${selectedGeoDivision.NIVNOME}'` +
      (getChartType(newGeoDivision) === "map" && newGeoBoundaryId !== "BR"
        ? ` and startswith(TERCODIGO,'${String(newGeoBoundaryId).slice(0, 2)}')`
        : "");

    const url =
      initialDate.value || finalDate.value
        ? limitByDate(baseUrl, initialDate.value, finalDate.value)
        : limitQuery(
            baseUrl,
            topN.value || DEFAULT_LIMIT * selectedGeoDivision.regionCount
          );

    setIsLoading(true);

    const response = await fetch(url);
    const json = await response.json();
    setSeries(json.value);

    setIsLoading(false);
  }

  const chartType = getChartType(geoDivision);

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
          geoBoundaryValue={geoBoundaryValue}
        />
      )}
    </ChartSection>
  );
}
