import React from "react";

import { NoData } from "../../common/NoData";
import { Container } from "./Container";

export function ChartNoData() {
  return (
    <Container>
      <NoData text="Sem dados" />
    </Container>
  );
}
