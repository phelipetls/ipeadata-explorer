import React, { useState } from "react";

import { useQuery } from "react-query";

import { Select, InputLabel, FormControl, Grow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Loading } from "./Loading";

import {
  getChartType,
  getContainingRegions,
  getDivisionsUrl,
  unpluralize,
} from "../api/ibge";

const useStyles = makeStyles(() => ({
  formElement: {},
}));

async function fetchGeoBoundaryIds(boundary) {
  const url = getDivisionsUrl(boundary);
  const boundaries = await (await fetch(url)).json();

  return boundaries.map(boundary => ({
    id: boundary.id,
    name: boundary.nome,
  }));
}

export function ChartFormGeography(props) {
  const classes = useStyles();

  const [geoDivision, setGeoDivision] = useState(props.geoDivision);
  const [geoBoundary, setGeoBoundary] = useState("Brasil");
  let [geoBoundaryId, setGeoBoundaryId] = useState(null);

  const { isLoading, data: geoBoundaryIds = [] } = useQuery(
    [geoBoundary],
    fetchGeoBoundaryIds
  );

  geoBoundaryId = geoBoundaryId || geoBoundaryIds[0];

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
          <Grow in={true}>
            <FormControl variant="outlined" className={classes.formElement}>
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
                {getContainingRegions(geoDivision).map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grow>

          {geoBoundary !== "Brasil" &&
            (isLoading ? (
              <Loading />
            ) : (
              <Grow in={true}>
                <FormControl variant="outlined" className={classes.formElement}>
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
                    {geoBoundaryIds.map(boundary => (
                      <option key={boundary.name} value={boundary.id}>
                        {boundary.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grow>
            ))}
        </>
      )}
    </>
  );
}
