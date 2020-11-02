import React from "react";

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
import { schemeCategory10 as palette } from "d3-scale-chromatic";

import groupBy from "lodash.groupby";

export function ChartGeographicTimeseries({ series }) {
  const regions = [...new Set(series.map(row => row.TERNOME))];

  const seriesByDate = groupBy(series, row =>
    new Date(row["VALDATA"]).toLocaleDateString()
  );

  const lines = Object.entries(seriesByDate)
    .map(([date, regions]) =>
      regions.reduce(
        (lines, region) => ({
          ...lines,
          ...{ date, [region.TERNOME]: region.VALVALOR },
        }),
        {}
      )
    )
    .reverse();

  return (
    <ResponsiveContainer>
      <LineChart data={lines}>
        {regions.map((region, index) => (
          <Line
            type="monotone"
            key={region}
            dataKey={region}
            stroke={palette[index % regions.length]}
          />
        ))}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
