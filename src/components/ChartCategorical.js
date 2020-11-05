import React, { useState } from "react";

import { useQuery } from "react-query";

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { schemeCategory10 as palette } from "d3-scale-chromatic";

import { ChartSection } from "./ChartSection";
import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartContainer } from "./ChartContainer";

import { buildMetadataUrl } from "../api/odata";
import { getDateFilter } from "../api/odata";

const DEFAULT_LIMIT = 0;

const CATEGORY_COUNT_QUERY =
  "groupby((VALVALOR),aggregate($count as totalCount))&$orderby=totalCount desc";

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

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
  }

  const categories = data?.value || [];

  const categoriesCount = categories.map(category => ({
    [metadata.SERNOME]: category.VALVALOR,
    Contagem: category.totalCount,
  }));

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      <ChartContainer isLoading={isLoading} data={categoriesCount}>
        <ResponsiveContainer>
          <BarChart data={categoriesCount}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey={metadata.SERNOME} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Contagem" fill={palette[0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartSection>
  );
}
