import React from "react";

import { ComposableMap } from "react-simple-maps";
import { ExtendedFeature, geoMercator } from "d3-geo";
import { Feature } from "geojson";
import { ScaleQuantile } from "d3-scale";

import { MapLegend } from "./components";
import { SeriesMetadata } from "components/types";
import { useBreakpoint } from "components/utils/responsive";

const SVG_WIDTH = 800;
const LEGEND_WIDTH = 320;

const TITLE_HEIGHT = 30;
const MAP_HEIGHT = 480;
const LEGEND_HEIGHT = 44;
const SVG_HEIGHT = TITLE_HEIGHT + MAP_HEIGHT + LEGEND_HEIGHT;

interface getProjectionOptions {
  mapWidth: number;
  mapHeight: number;
}

function getProjection(
  outline: ExtendedFeature,
  { mapWidth, mapHeight }: getProjectionOptions
) {
  return geoMercator().fitExtent(
    [
      [0, TITLE_HEIGHT],
      [mapWidth, mapHeight],
    ],
    outline
  );
}

interface MapWrapperProps {
  scale: ScaleQuantile<string>;
  metadata: SeriesMetadata,
  outline: Feature,
  children: JSX.Element,
}

export function MapWrapper(props: MapWrapperProps) {
  const isExtraSmallScreen = useBreakpoint("xs");

  const { scale, metadata, outline, children: map } = props;

  const svgWidth = Math.min(window.innerWidth, SVG_WIDTH);
  const svgHeight = SVG_HEIGHT;

  const getProjectionFn = () => getProjection(outline, {
    mapWidth: svgWidth,
    mapHeight: MAP_HEIGHT,
  });

  return (
    <ComposableMap width={svgWidth} height={svgHeight} projection={getProjectionFn}>
      <text x={svgWidth / 2} textAnchor="middle" dominantBaseline="hanging">
        {metadata.SERNOME}
      </text>

      {map}

      <MapLegend
        scale={scale}
        title={metadata.UNINOME || ""}
        width={LEGEND_WIDTH}
        height={LEGEND_HEIGHT}
        x={
          isExtraSmallScreen
            ? (svgWidth - LEGEND_WIDTH) / 2
            : svgWidth - LEGEND_WIDTH
        }
        y={SVG_HEIGHT - LEGEND_HEIGHT - 1}
      />
    </ComposableMap>
  );
}
