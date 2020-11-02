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

import { buildSeriesUrl, limitQuery, limitByDate } from "../api/odata";
import { formatDateFromDatePicker } from "../api/utils";

const DEFAULT_LIMIT = 50;

export function ChartMacro({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const { isLoading, data } = useQuery(
    [code, initialDate, finalDate, lastN],
    async (code, initialDate, finalDate, lastN) => {
      let dateInterval = "";

      if (initialDate || finalDate) {
        const initialDateValue = formatDateFromDatePicker(initialDate);
        const finalDateValue = formatDateFromDatePicker(finalDate);

        dateInterval = `&$filter=${limitByDate(
          initialDateValue,
          finalDateValue
        )}`;
      } else {
        dateInterval = limitQuery(lastN);
      }

      const url = buildSeriesUrl(code) + dateInterval;

      return await (await fetch(url)).json();
    }
  );

  const series = data?.value || [];

  function handleSubmit(e) {
    e.preventDefault();

    const { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
  }

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
