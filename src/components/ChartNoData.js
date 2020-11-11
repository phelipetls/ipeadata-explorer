import React from "react";

import { NoData } from "./NoData";
import { ChartContainer } from "./ChartContainer";

export function ChartNoData() {
  return (
    <ChartContainer>
      <NoData text="Sem dados" />
    </ChartContainer>
  );
}
