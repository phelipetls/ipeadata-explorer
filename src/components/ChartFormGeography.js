import React, { useState } from "react";

import { getChartType } from "../api/ibge";

import { SelectGeoDivisions } from "./SelectGeoDivisions";
import { SelectGeoBoundaryId } from "./SelectGeoBoundaryId";
import { SelectGeoBoundary } from "./SelectGeoBoundary";

export function ChartFormGeography(props) {
  // FIXME: Do not use props as initial state
  const [geoDivision, setGeoDivision] = useState(props.geoDivision);
  const [geoBoundary, setGeoBoundary] = useState("Brasil");

  return (
    <>
      {/* Geographic division to visualize data, e.g., states, municipalities */}
      <SelectGeoDivisions
        geoDivisions={props.geoDivisions}
        handleChange={e => setGeoDivision(e.target.value)}
      />

      {getChartType(geoDivision) === "map" && (
        <>
          {/* The user may give a boundary to the map, e.g. a state etc. The
          default is "Brazil", which means the whole country so no boundary */}
          <SelectGeoBoundary
            geoBoundary={geoBoundary}
            geoDivision={geoDivision}
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
