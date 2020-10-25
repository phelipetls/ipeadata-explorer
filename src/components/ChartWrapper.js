import React from "react";

import { useTheme } from "@material-ui/styles";

import Loading from "./Loading";
import NoData from "./NoData";

export default function ChartWrapper({ isLoading, series, children }) {
  const theme = useTheme();

  return isLoading ? (
    <Loading style={{ minHeight: theme.chart.minHeight }} />
  ) : series.length === 0 ? (
    <NoData text="Sem dados" style={{ minHeight: theme.chart.minHeight }} />
  ) : (
    children
  );
}
