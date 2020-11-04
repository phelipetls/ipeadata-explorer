import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartBar } from "./ChartBar";
import { ChartSection } from "./ChartSection";
import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartContainer } from "./ChartContainer";

import { buildMetadataUrl } from "../api/odata";
import { getDateFilter } from "../api/odata";

const DEFAULT_LIMIT = 0;

const CATEGORY_COUNT_QUERY =
  "groupby((VALVALOR),aggregate($count as totalCount))&$orderby=totalCount desc";

const parseJsonCount = json =>
  json.reduce(
    (acc, category) => ({
      ...acc,
      [category.VALVALOR]: category.totalCount,
    }),
    {}
  );

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

  const categoriesCount = parseJsonCount(data?.value || []);

  const labels = Object.keys(categoriesCount);
  const datasets = [
    {
      label: metadata.UNINOME,
      data: Object.values(categoriesCount),
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    let { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      <ChartContainer isLoading={isLoading} data={categoriesCount}>
        <ChartBar metadata={metadata} labels={labels} datasets={datasets} />
      </ChartContainer>
    </ChartSection>
  );
}
