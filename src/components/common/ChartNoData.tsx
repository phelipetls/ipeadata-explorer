import React from "react";

import { NoData, ChartContainer  } from "components/common";

export function ChartNoData() {
  return (
    <ChartContainer>
      <NoData text="Sem dados" />
    </ChartContainer>
  );
}
