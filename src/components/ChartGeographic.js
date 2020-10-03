import React, { useState, useEffect } from "react";

import { useTheme } from "@material-ui/styles";

import {
  limitByDate,
  buildSeriesUrl,
  fetchGeographicDivisions,
} from "../api/odata";

import { subtractDateByPeriod } from "../api/utils";

import { getChartType } from "../api/ibge";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartFormDate from "./ChartFormDate";
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

      const newGeoDivision = availableGeoDivisions[0];
      setGeoDivision(newGeoDivision);

      const startDate = subtractDateByPeriod({
        date: metadata.SERMAXDATA,
        offset: DEFAULT_LIMIT,
        period: metadata.PERNOME,
      });

      const url =
        buildSeriesUrl(code) +
        "&$filter=" +
        `NIVNOME eq '${newGeoDivision}' and ` +
        `VALDATA ge ${startDate}`;

      setIsLoading(true);

      const response = await fetch(url);
      const json = await response.json();
      setSeries(json.value);

      setIsLoading(false);
    }

    fetchSeries();
  }, [metadata, code]);

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
    setGeoDivision(newGeoDivision);

    const newGeoBoundaryValue = geoBoundaryValue
      ? geoBoundaryValue.value
      : "BR";
    setGeoBundaryValue(newGeoBoundaryValue);

    const boundaryId = String(newGeoBoundaryValue).slice(0, 2);

    const boundaryFilter =
      getChartType(newGeoDivision) === "map" && newGeoBoundaryValue !== "BR"
        ? ` and startswith(TERCODIGO,'${boundaryId}')`
        : "";

    let dateFilter = "";

    if (topN.value) {
      const startDate = subtractDateByPeriod({
        date: metadata.SERMAXDATA,
        period: metadata.PERNOME,
        offset: topN.value,
      });
      dateFilter = limitByDate(startDate);
    } else if (initialDate.value || finalDate.value) {
      dateFilter = limitByDate(initialDate.value, finalDate.value);
    }

    const url =
      buildSeriesUrl(code) +
      "&$filter=" +
      `NIVNOME eq '${newGeoDivision}'` +
      boundaryFilter +
      dateFilter;

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
        <ChartFormDate metadata={metadata} />
        {!geoDivision ? (
          <Loading />
        ) : (
          <ChartFormGeography
            geoDivision={geoDivision}
            geoDivisions={geoDivisions}
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
