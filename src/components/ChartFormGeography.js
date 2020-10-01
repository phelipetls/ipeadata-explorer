import React, { useState, useEffect } from "react";
import { Select, InputLabel, FormControl } from "@material-ui/core";
import {
  getChartType,
  getTopRegions,
  getRegionsUrl,
  unpluralize,
} from "../api/ibge";

import Loading from "./Loading";

export default function ChartFormGeography(props) {
  const [geoDivision, setGeoDivision] = useState(props.geoDivision);
  const [geoBoundary, setGeoBoundary] = useState("Brasil");
  const [geoBoundaryId, setGeoBoundaryId] = useState("");
  const [geoBoundaries, setGeoBoundaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGeoRegionsNames() {
      if (geoBoundary === "Brasil") return;

      const url = getRegionsUrl(geoBoundary);

      setIsLoading(true);
      const response = await fetch(url);
      const boundariesJson = await response.json();
      const boundaries = boundariesJson.map(boundary => ({
        id: boundary.id,
        name: boundary.nome,
      }));
      setGeoBoundaries(boundaries);
      setGeoBoundaryId(boundaries[0].id);
      setIsLoading(false);
    }

    fetchGeoRegionsNames();
  }, [geoBoundary]);

  return (
    <>
      <FormControl required variant="outlined">
        <InputLabel htmlFor="geoDivision" shrink>
          Divisões geográficas
        </InputLabel>
        <Select
          native
          value={geoDivision}
          label="Divisões geográficas"
          onChange={e => setGeoDivision(e.target.value)}
          inputProps={{ name: "geoDivision", id: "geoDivision" }}
        >
          {props.geoDivisions.map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>
      </FormControl>

      {getChartType(geoDivision) === "map" && (
        <>
          <FormControl variant="outlined">
            <InputLabel htmlFor="geoBoundary" shrink>
              Limite geográfico
            </InputLabel>
            <Select
              native
              value={geoBoundary}
              label="Limite geográfico"
              onChange={e => setGeoBoundary(e.target.value)}
              inputProps={{ name: "geoBoundary", id: "geoBoundary" }}
            >
              {getTopRegions(geoDivision).map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
          </FormControl>

          {geoBoundary === "Brasil" ? null : isLoading ? (
            <Loading />
          ) : (
            <FormControl variant="outlined">
              <InputLabel htmlFor="geoBoundaryId" shrink>
                {unpluralize(geoBoundary)}
              </InputLabel>
              <Select
                native
                value={geoBoundaryId}
                label={unpluralize(geoBoundary)}
                onChange={e => setGeoBoundaryId(e.target.value)}
                inputProps={{
                  name: "geoBoundaryId",
                  id: "geoBoundaryId",
                }}
              >
                {geoBoundaries.map(boundary => (
                  <option key={boundary.name} value={boundary.id}>
                    {boundary.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
        </>
      )}
    </>
  );
}
