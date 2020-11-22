import React from "react";

import { Loading as FullHeightLoading } from "../../common/Loading";
import { Container } from "./Container";

export function Loading() {
  return (
    <Container>
      <FullHeightLoading />
    </Container>
  );
}
