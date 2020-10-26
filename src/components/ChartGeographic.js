import React, { useState, useEffect } from "react";

import {
  limitByDate,
  buildSeriesUrl,
  fetchGeographicDivisions,
} from "../api/odata";
import { formatDateFromDatePicker, subtractSeriesMaxDate } from "../api/utils";
import { getChartType } from "../api/ibge";

import Loading from "./Loading";
import ChartForm from "./ChartForm";
import ChartFormDate from "./ChartFormDate";
import ChartFormGeography from "./ChartFormGeography";
import ChartSection from "./ChartSection";
import ChartGeographicMap from "./ChartGeographicMap";
import ChartGeographicTimeseries from "./ChartGeographicTimeseries";
import ChartWrapper from "./ChartWrapper";

const DEFAULT_LIMIT = 5;

export default function ChartGeographic({ code, metadata }) {
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

      let dateFilter = "";

      if (metadata.PERNOME !== "Não se aplica") {
        const startDate = subtractSeriesMaxDate({
          metadata: metadata,
          offset: DEFAULT_LIMIT,
        });

        dateFilter = ` and VALDATA ge ${startDate}`;
      }

      const url =
        buildSeriesUrl(code) +
        "&$filter=" +
        `NIVNOME eq '${newGeoDivision}'` +
        dateFilter;

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
      lastN,
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

    if (initialDate.value || finalDate.value) {
      const initialDateValue = formatDateFromDatePicker(initialDate.value);
      const finalDateValue = formatDateFromDatePicker(finalDate.value);

      dateFilter = " and " + limitByDate(initialDateValue, finalDateValue);
    } else if (metadata.PERNOME !== "Não se aplica") {
      const startDate = subtractSeriesMaxDate({
        metadata: metadata,
        offset: lastN.value || DEFAULT_LIMIT,
      });

      dateFilter = " and " + limitByDate(startDate);
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

      <ChartWrapper isLoading={isLoading} series={series}>
        {chartType === "line" ? (
          <ChartGeographicTimeseries series={series} metadata={metadata} />
        ) : (
          <ChartGeographicMap
            series={series}
            metadata={metadata}
            geoDivision={geoDivision}
            geoBoundaryValue={geoBoundaryValue}
          />
        )}
      </ChartWrapper>
    </ChartSection>
  );
}
