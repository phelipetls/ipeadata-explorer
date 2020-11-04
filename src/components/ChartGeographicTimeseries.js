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

export function ChartGeographicTimeseries({ seriesByDate }) {
  const lines = Object.entries(seriesByDate)
    .map(([date, regions]) =>
      regions.reduce(
        (acc, region) => ({
          ...acc,
          ...{ date, [region.TERNOME]: region.VALVALOR },
        }),
        {}
      )
    )
    .reverse();

  const regions = Object.keys(lines[0]).filter(key => key !== "date");

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
