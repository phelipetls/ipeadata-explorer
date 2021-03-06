import { ChartError, ChartLoading, ChartNoData } from "components";
import * as React from "react";

interface Props {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  children: JSX.Element;
}

export function SeriesChart(props: Props) {
  const { isLoading, isError, isEmpty, children } = props;

  return isLoading ? (
    <ChartLoading />
  ) : isError ? (
    <ChartError />
  ) : isEmpty ? (
    <ChartNoData />
  ) : (
    children
  );
}
