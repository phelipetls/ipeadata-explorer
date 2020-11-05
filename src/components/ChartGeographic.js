import React, { useState } from "react";

import { useQuery } from "react-query";

import { Loading } from "./Loading";
import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartFormGeography } from "./ChartFormGeography";
import { ChartSection } from "./ChartSection";
import { ChartGeographicMap } from "./ChartGeographicMap";
import { ChartGeographicTimeseries } from "./ChartGeographicTimeseries";
import { ChartContainer } from "./ChartContainer";

import { buildMetadataUrl, buildSeriesUrl, getDateFilter } from "../api/odata";
import { getChartType } from "../api/ibge";

import groupBy from "lodash/groupBy";

const DEFAULT_OFFSET = 5;

async function fetchGeographicDivisions(_, code) {
  const url =
    buildMetadataUrl(code) +
    "/Valores?" +
    "$apply=filter(not startswith(NIVNOME,'AMC'))" +
    "/groupby((NIVNOME),aggregate($count as Count))" +
    "&$orderby=Count asc";
  const response = await fetch(url);
  const json = await response.json();
  return json.value.map(division => division.NIVNOME);
}

export function ChartGeographic({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_OFFSET);

  let [division, setDivision] = useState(null);
  const [boundaryId, setBoundaryId] = useState("BR");

  const { isLoading: isLoadingDivisions, data: divisions = [] } = useQuery(
    ["Fetch available geographic divisions", code],
    fetchGeographicDivisions
  );

  division = division || divisions[3];

  const { isLoading: isLoadingData, data = {} } = useQuery(
    [code, initialDate, finalDate, lastN, division, boundaryId],
    async () => {
      const dateFilter = getDateFilter(initialDate, finalDate, lastN, metadata);

      const boundaryFilter =
        chartType === "map" && boundaryId !== "BR"
          ? ` and startswith(TERCODIGO,'${"".slice.call(boundaryId, 0, 2)}')`
          : "";

      const divisionFilter = ` and NIVNOME eq '${division}'`;

      const url =
        buildSeriesUrl(code) +
        "&$filter=" +
        dateFilter +
        divisionFilter +
        boundaryFilter;

      return await (await fetch(url)).json();
    },
    { enabled: divisions.length > 0 }
  );

  const series = data?.value || [];
  const isLoading = isLoadingData || isLoadingDivisions;

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

  const chartType = getChartType(division);

  const seriesByDate = groupBy(series, "VALDATA");

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
        {isLoadingDivisions ? (
          <Loading />
        ) : (
          <ChartFormGeography division={division} divisions={divisions} />
        )}
      </ChartForm>

      <ChartContainer isLoading={isLoading} data={series}>
        {chartType === "line" ? (
          <ChartGeographicTimeseries seriesByDate={seriesByDate} />
        ) : (
          <ChartGeographicMap
            seriesByDate={seriesByDate}
            metadata={metadata}
            division={division}
            boundaryId={boundaryId}
          />
        )}
      </ChartContainer>
    </ChartSection>
  );
}
