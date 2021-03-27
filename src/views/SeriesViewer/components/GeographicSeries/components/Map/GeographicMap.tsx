import { DivisionToPlotAsMap } from "api/ibge";
import * as React from "react";
import { SeriesMetadata, SeriesValuesGeographic } from "types";
import { ChoroplethMap, MapTooltip } from "./components";

interface tooltipPositionType {
  x: number | undefined;
  y: number | undefined;
}

interface Props {
  series: SeriesValuesGeographic[];
  metadata: SeriesMetadata;
  division: DivisionToPlotAsMap;
  boundaryId: string;
}

export const GeographicMap: React.FC<Props> = props => {
  const [tooltipText, setTooltipText] = React.useState("");
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState<
    tooltipPositionType
  >({
    x: undefined,
    y: undefined,
  });

  return (
    <>
      <ChoroplethMap
        {...props}
        setTooltipPosition={setTooltipPosition}
        setTooltipText={setTooltipText}
        setTooltipOpen={setTooltipOpen}
      />

      <MapTooltip
        position={tooltipPosition}
        open={tooltipOpen}
        title={tooltipText}
      >
        <div />
      </MapTooltip>
    </>
  );
};
