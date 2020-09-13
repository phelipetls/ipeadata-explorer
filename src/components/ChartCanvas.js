import React from "react";
import ChartContainer from "./ChartContainer";

export default function ChartCanvas({ id }) {
  return (
    <ChartContainer>
      <canvas id={id} aria-label="Gráfico">
        <p>Gráfico</p>
      </canvas>
    </ChartContainer>
  );
}
