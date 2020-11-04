import React, { useState, useEffect, useRef } from "react";

import { useQuery } from "react-query";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoMercator } from "d3-geo";
import { scaleQuantile } from "d3-scale";
import { schemeBlues as palette } from "d3-scale-chromatic";
import { getMapUrl, getDivisionsUrl } from "../api/ibge";

import { Loading } from "./Loading";
import { MapTooltip } from "./MapTooltip.js";

import { select as d3Select } from "d3-selection";
import { format as d3Format } from "d3-format";
import { legendColor } from "d3-svg-legend";

import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

async function getOutlineMap(geoBoundaryId) {
  const url = getMapUrl({ geoBoundaryId, format: "application/vnd.geo+json" });
  const response = await fetch(url);
  return await response.json();
}

async function getDivisionsInfo(division) {
  const url = getDivisionsUrl(division);
  const response = await fetch(url);
  const json = await response.json();
  return keyBy(json, "id");
}

function getProjection(outline, width, height) {
  const padding = 20;

  const boundingBox = [
    [padding, padding],
    [width, height],
  ];

  return geoMercator().fitExtent(boundingBox, outline);
}

function Legend({ scale, title }) {
  const legendRef = useRef();

  useEffect(() => {
    const legendContainer = d3Select(legendRef.current);

    const legend = legendColor()
      .scale(scale)
      .labelFormat(d3Format(".0f"))
      .labelDelimiter(" a ")
      .title(title);

    legendContainer.call(legend);
  }, [scale, title]);

  return <g ref={legendRef} transform="translate(20, 20)"></g>;
}

const ChoroplethMap = React.memo(props => {
  const {
    series,
    metadata,
    geoDivision,
    geoBoundaryId,
    setTooltipPosition,
    setTooltipText,
    setTooltipOpen,
  } = props;

  const rowsByPeriod = groupBy(series, "VALDATA");

  for (const [year, value] of Object.entries(rowsByPeriod)) {
    rowsByPeriod[year] = keyBy(value, "TERCODIGO");
  }

  const periods = Object.keys(rowsByPeriod);
  const period = periods[0];

  const rowsInPeriod = rowsByPeriod[period];
  const valuesInPeriod = Object.values(rowsInPeriod).map(
    row => row["VALVALOR"]
  );

  const { isLoading: isLoadingOutline, data: outline } = useQuery(
    [geoBoundaryId],
    getOutlineMap
  );

  const { isLoading: isLoadingDivisionsInfo, data: divisionsInfo } = useQuery(
    [geoDivision],
    getDivisionsInfo
  );

  if (isLoadingOutline || isLoadingDivisionsInfo) return <Loading />;

  const width = Math.min(window.innerWidth, 800);
  const height = 480;
  const projection = getProjection(outline, width, height);

  const colorScale = scaleQuantile()
    .domain(valuesInPeriod)
    .range(palette[4]);

  return (
    <ComposableMap width={width} height={height} projection={projection}>
      <Geographies geography={getMapUrl({ geoBoundaryId, geoDivision })}>
        {({ geographies }) =>
          geographies.map(geo => {
            const id = geo.properties.codarea;
            const name = divisionsInfo[id]["nome"];
            const value = rowsByPeriod[period]?.[id]?.["VALVALOR"] || 0;
            return (
              <Geography
                key={id}
                geography={geo}
                fill={colorScale(value)}
                onMouseEnter={() => {
                  setTooltipOpen(true);
                  setTooltipText(`${name} ― ${value}`);
                }}
                onMouseLeave={() => {
                  setTooltipOpen(false);
                  setTooltipText("");
                }}
                onMouseMove={e => {
                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                }}
              />
            );
          })
        }
      </Geographies>

      <Legend scale={colorScale} title={metadata.UNINOME} />
    </ComposableMap>
  );
});

export const ChartGeographicMap = props => {
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
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
