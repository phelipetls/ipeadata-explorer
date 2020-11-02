import React, { useState } from "react";

import { useQuery } from "react-query";

import { Loading } from "./Loading";
import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartFormGeography } from "./ChartFormGeography";
import { ChartSection } from "./ChartSection";
import { ChartGeographicMap } from "./ChartGeographicMap";
import { ChartGeographicTimeseries } from "./ChartGeographicTimeseries";
import { ChartWrapper } from "./ChartWrapper";

import {
  limitByDate,
  buildSeriesUrl,
  fetchGeographicDivisions,
} from "../api/odata";
import { formatDateFromDatePicker, subtractSeriesMaxDate } from "../api/utils";
import { getChartType } from "../api/ibge";

const DEFAULT_LIMIT = 5;

export function ChartGeographic({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);
  const [geoBoundaryId, setGeoBundaryId] = useState("BR");

  let [geoDivision, setGeoDivision] = useState(null);

  const {
    isLoading: isLoadingGeoDivisions,
    data: geoDivisions = [],
  } = useQuery(["Geographic divisions", code], () =>
    fetchGeographicDivisions(code)
  );

  geoDivision = geoDivision || geoDivisions[0];

  const chartType = getChartType(geoDivision);

  const { isLoading, data = {} } = useQuery(
    [code, initialDate, finalDate, lastN, geoDivision, geoBoundaryId],
    async (code, initialDate, finalDate, lastN, geoDivision, geoBoundaryId) => {
      let dateFilter = "";

      if (initialDate || finalDate) {
        dateFilter = limitByDate(
          formatDateFromDatePicker(initialDate),
          formatDateFromDatePicker(finalDate)
        );
      } else if (metadata.PERNOME !== "Não se aplica") {
        dateFilter = limitByDate(
          subtractSeriesMaxDate({
            metadata: metadata,
            offset: lastN || DEFAULT_LIMIT,
          })
        );
      }

      dateFilter = dateFilter ? " and " + dateFilter : dateFilter;

      const boundaryFilter =
        chartType === "map" && geoBoundaryId !== "BR"
          ? ` and startswith(TERCODIGO,'${"".slice.call(geoBoundaryId, 0, 2)}')`
          : "";

      const divisionFilter = `NIVNOME eq '${geoDivision}'`;

      const url =
        buildSeriesUrl(code) +
        "&$filter=" +
        divisionFilter +
        boundaryFilter +
        dateFilter;

      return await (await fetch(url)).json();
    },
    { enabled: geoDivisions.length > 0 }
  );

  function handleSubmit(e) {
    e.preventDefault();

    const {
      initialDate,
      finalDate,
      lastN,
      geoDivision,
      geoBoundaryId,
    } = e.target.elements;

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
    if (geoDivision) setGeoDivision(geoDivision.value);
    if (geoBoundaryId) setGeoBundaryId(geoBoundaryId.value);
  }

  const series = data?.value || [];

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
        {isLoadingGeoDivisions ? (
          <Loading />
        ) : (
          <ChartFormGeography
            geoDivision={geoDivision}
            geoDivisions={geoDivisions}
          />
        )}
      </ChartForm>

      <ChartWrapper isLoading={isLoading || isLoadingGeoDivisions} series={series}>
        {chartType === "line" ? (
          <ChartGeographicTimeseries series={series} metadata={metadata} />
        ) : (
          <ChartGeographicMap
            series={series}
            metadata={metadata}
            geoDivision={geoDivision}
            geoBoundaryId={geoBoundaryId}
          />
        )}
      </ChartWrapper>
    </ChartSection>
  );
}
