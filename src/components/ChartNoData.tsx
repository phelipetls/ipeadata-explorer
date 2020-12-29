import * as React from "react";

import { NoData, ChartContainer } from "components";

export function ChartNoData() {
  return (
    <ChartContainer>
      <NoData text="Sem dados" />
    </ChartContainer>
  );
}
