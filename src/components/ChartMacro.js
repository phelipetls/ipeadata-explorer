import React, { useState } from "react";

import { useQuery } from "react-query";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartSection } from "./ChartSection";
import { ChartContainer } from "./ChartContainer";

import { buildSeriesUrl, getDateFilter } from "../api/odata";

const DEFAULT_OFFSET = 50;

export function ChartMacro({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_OFFSET);

  const { isLoading, data } = useQuery(
    [code, initialDate, finalDate, lastN],
    async () => {
      const dateFilter = getDateFilter(initialDate, finalDate, lastN, metadata);

      const url = buildSeriesUrl(code) + "&$filter=" + dateFilter;
      return await (await fetch(url)).json();
    }
  );

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
  }

  const series = data?.value || [];

  const lines = series.map(row => ({
    date: new Date(row.VALDATA).toLocaleDateString(),
    [code]: row.VALVALOR,
  }));

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      <ChartContainer isLoading={isLoading} data={lines}>
        <ResponsiveContainer>
          <LineChart data={lines}>
            <Line type="monotone" dataKey={code} stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartSection>
  );
}
