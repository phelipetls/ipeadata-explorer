import React, { useState } from "react";

import { useQuery } from "react-query";

import { Loading } from "../../../common/Loading";

import { ChartLoading } from "../ChartLoading";
import { ChartNoData } from "../ChartNoData";
import { ChartFilters } from "../ChartFilters";
import { DateInputs } from "../DateInputs";
import { ChartSection } from "../ChartSection";

import { Map } from "./Map";
import { GeographyInputs } from "./GeographyInputs";
import { GeographicLineChart } from "./GeographicLineChart";

import {
  buildSeriesUrl,
  getDateFilter,
  buildFilter,
  buildGeographicDivisionsUrl,
} from "../../../api/odata";
import { shouldPlotMap } from "./api/ibge";

const DEFAULT_LIMIT = 5;

async function fetchGeographicDivisions(_, code) {
  const url = buildGeographicDivisionsUrl(code);
  const json = await (await fetch(url)).json();
  return json.value.map(division => division.NIVNOME);
}

function getBoundaryFilter(boundaryId, division) {
  if (!shouldPlotMap(division) || boundaryId === "BR") return "";
  return `startswith(TERCODIGO,'${String(boundaryId).slice(0, 2)}')`;
}

export function ChartGeographic({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const [division, setDivision] = useState(null);
  const [boundaryId, setBoundaryId] = useState("BR");

  const { isLoading: isLoadingDivisions, data: divisions = [] } = useQuery(
    ["Fetch available geographic divisions", code],
    fetchGeographicDivisions,
    { onSuccess: ([firstDivision]) => setDivision(firstDivision) }
  );

  const { isLoading: isLoadingData, data = {} } = useQuery(
    [code, initialDate, finalDate, lastN, division, boundaryId],
    async () => {
      const dateFilter = getDateFilter(initialDate, finalDate, lastN, metadata);
      const boundaryFilter = getBoundaryFilter(boundaryId, division);
      const divisionFilter = `NIVNOME eq '${division}'`;

      const url =
        buildSeriesUrl(code) +
        buildFilter(dateFilter, divisionFilter, boundaryFilter);

      return await (await fetch(url)).json();
    },
    { enabled: division }
  );

  function handleSubmit(e) {
    e.preventDefault();

    const {
      initialDate,
      finalDate,
      lastN,
      division,
      boundaryId,
    } = e.target.elements;

    if (initialDate.value) setInitialDate(initialDate.value);
    if (finalDate.value) setFinalDate(finalDate.value);
    if (lastN.value) setLastN(lastN.value);
    if (division) setDivision(division.value);
    if (boundaryId) setBoundaryId(boundaryId.value);
  }

  const isLoading = isLoadingData || isLoadingDivisions;

  const series = (data && data.value) || [];

  return (
    <ChartSection>
      <ChartFilters onSubmit={handleSubmit}>
        <DateInputs metadata={metadata} />
        {isLoadingDivisions ? (
          <Loading />
        ) : (
          <GeographyInputs division={division} divisions={divisions} />
        )}
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : series.length === 0 ? (
        <ChartNoData />
      ) : shouldPlotMap(division) ? (
        <Map
          series={series}
          metadata={metadata}
          division={division}
          boundaryId={boundaryId}
        />
      ) : (
        <GeographicLineChart series={series} metadata={metadata} />
      )}
    </ChartSection>
  );
}
