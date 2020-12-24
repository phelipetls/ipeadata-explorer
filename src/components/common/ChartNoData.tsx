import React from "react";

import { NoData, Container  } from "components/common";

export function ChartNoData() {
  return (
    <Container>
      <NoData text="Sem dados" />
    </Container>
  );
}
