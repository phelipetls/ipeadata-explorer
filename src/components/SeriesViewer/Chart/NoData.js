import React from "react";

import { NoData as FullHeightNoData } from "../../common/NoData";
import { Container } from "./Container";

export function NoData() {
  return (
    <Container>
      <FullHeightNoData text="Sem dados" />
    </Container>
  );
}
