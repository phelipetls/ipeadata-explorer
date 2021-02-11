import * as React from "react";

import { EmptyState, ChartContainer } from "components";

interface Props {
  text: string;
}

export function ChartEmpty({ text }: Props) {
  return (
    <ChartContainer>
      <EmptyState text={text} />
    </ChartContainer>
  );
}
