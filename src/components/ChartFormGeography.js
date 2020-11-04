import React, { useState } from "react";

import { getChartType, getContainingDivisions } from "../api/ibge";

import { SelectGeoDivisions } from "./SelectGeoDivisions";
import { SelectGeoBoundaryId } from "./SelectGeoBoundaryId";
import { SelectGeoBoundary } from "./SelectGeoBoundary";

export function ChartFormGeography(props) {
  const [geoDivision, setGeoDivision] = useState(null);
  const [geoBoundary, setGeoBoundary] = useState("Brasil");

  const geoBoundaries = getContainingDivisions(
    geoDivision || props.geoDivision
  );

  return (
    <>
      {/* Geographic division to visualize data, e.g., states, municipalities */}
      <SelectGeoDivisions
        defaultValue={props.geoDivision}
        geoDivisions={props.geoDivisions}
        handleChange={e => setGeoDivision(e.target.value)}
      />

      {getChartType(geoDivision || props.geoDivision) === "map" && (
        <>
          {/* The user may give a boundary to the map, e.g. a state etc. The
          default is "Brazil", which means the whole country so no boundary */}
          <SelectGeoBoundary
            geoBoundary={geoBoundary}
            geoBoundaries={geoBoundaries}
            handleChange={e => setGeoBoundary(e.target.value)}
          />

          {/* If boundary is not Brazil, user must specify a specific value of
          a boundary, e.g., state of São Paulo if geoBoundary is "Estados" */}
          {geoBoundary !== "Brasil" && (
            <SelectGeoBoundaryId geoBoundary={geoBoundary} />
          )}
        </>
      )}
    </>
  );
}
