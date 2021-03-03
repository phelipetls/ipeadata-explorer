import { ChartContainer, EmptyState } from "components";
import * as React from "react";

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
