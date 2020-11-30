import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartLoading } from "../ChartLoading";
import { ChartNoData } from "../ChartNoData";
import { ChartSection } from "../ChartSection";
import { ChartFilters } from "../ChartFilters";
import { DateInputs } from "../DateInputs";

import { buildMetadataUrl, getDateFilter } from "../../../api/odata";

import { BarChart } from "./BarChart";

const DEFAULT_LIMIT = 1;

const CATEGORY_COUNT_QUERY =
  "groupby((VALVALOR),aggregate($count as count))&$orderby=count desc";

export function ChartCategorical({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const { isLoading, data } = useQuery(
    [code, initialDate, finalDate, lastN],
    async () => {
      const dateFilter = getDateFilter(initialDate, finalDate, lastN, metadata);

      const url =
        buildMetadataUrl(code) +
        `/ValoresStr?$apply=filter(${dateFilter})/${CATEGORY_COUNT_QUERY}`;

      return await (await fetch(url)).json();
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    let { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate.value) setInitialDate(initialDate.value);
    if (finalDate.value) setFinalDate(finalDate.value);
    if (lastN.value) setLastN(lastN.value);
  }

  const categories = (data && data.value) || [];

  const labels = categories.map(category => category.VALVALOR);
  const datasets = [
    {
      label: metadata.UNINOME,
      data: categories.map(category => category.count),
    },
  ];

  return (
    <ChartSection>
      <ChartFilters onSubmit={handleSubmit}>
        <DateInputs metadata={metadata} />
      </ChartFilters>

      {isLoading ? (
        <ChartLoading />
      ) : categories.length === 0 ? (
        <ChartNoData />
      ) : (
        <BarChart metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
