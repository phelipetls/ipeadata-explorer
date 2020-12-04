import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartLoading } from "../ChartLoading";
import { ChartNoData } from "../ChartNoData";
import { ChartSection } from "../ChartSection";
import { ChartFilters } from "../ChartFilters";
import { DateInputs } from "../DateInputs";

import { buildCountByCategoryUrl, getDateFilter } from "../../../api/odata";

import { BarChart } from "./BarChart";

const DEFAULT_LIMIT = 1;

export function ChartCategorical({ code, metadata }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const { isLoading, data } = useQuery(
    [code, startDate, endDate, lastN],
    async () => {
      const dateFilter = getDateFilter({
        start: startDate,
        end: endDate,
        lastN,
        metadata,
      });
      const url = buildCountByCategoryUrl(code, { filter: dateFilter });
      return await (await fetch(url)).json();
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    let { startDate, endDate, lastN } = e.target.elements;

    if (startDate.value) setStartDate(startDate.value);
    if (endDate.value) setEndDate(endDate.value);
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
