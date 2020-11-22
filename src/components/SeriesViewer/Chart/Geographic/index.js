import React, { useState } from "react";

import { useQuery } from "react-query";

import { Loading } from "../../../common/Loading";

import { Loading as LoadingChart } from "../Loading";
import { NoData } from "../NoData";
import { Form } from "../Form";
import { DateInputs } from "../DateInputs";
import { ChartSection } from "../ChartSection";

import { Map } from "./Map";
import { GeographyInputs } from "./GeographyInputs";
import { GeographicLineChart } from "./GeographicLineChart";

import {
  buildMetadataUrl,
  buildSeriesUrl,
  getDateFilter,
} from "../../../api/odata";
import { shouldPlotMap } from "./api/ibge";

const DEFAULT_LIMIT = 5;

async function fetchGeographicDivisions(_, code) {
  const url =
    buildMetadataUrl(code) +
    "/Valores?" +
    "$apply=filter(not startswith(NIVNOME,'AMC'))" +
    "/groupby((NIVNOME),aggregate($count as Count))" +
    "&$orderby=Count asc";
  const json = await (await fetch(url)).json();
  return json.value.map(division => division.NIVNOME);
}

export function ChartGeographic({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const [division, setDivision] = useState(null);
  const [boundaryId, setBoundaryId] = useState("BR");

  const { isLoading: isLoadingDivisions, data: divisions = [] } = useQuery(
    ["Fetch available geographic divisions", code],
    fetchGeographicDivisions
  );

  if (!isLoadingDivisions && division === null) {
    setDivision(divisions[0]);
  }

  const { isLoading: isLoadingData, data = {} } = useQuery(
    [code, initialDate, finalDate, lastN, division, boundaryId],
    async () => {
      const dateFilter = getDateFilter(initialDate, finalDate, lastN, metadata);

      const boundaryFilter =
        shouldPlotMap(division) && boundaryId !== "BR"
          ? ` and startswith(TERCODIGO,'${String(boundaryId).slice(0, 2)}')`
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
      <Form onSubmit={handleSubmit}>
        <DateInputs metadata={metadata} />
        {isLoadingDivisions ? (
          <Loading />
        ) : (
          <GeographyInputs division={division} divisions={divisions} />
        )}
      </Form>

      {isLoading ? (
        <LoadingChart />
      ) : series.length === 0 ? (
        <NoData />
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
