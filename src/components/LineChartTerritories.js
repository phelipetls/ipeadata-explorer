import React, { useState, useEffect } from "react";
import groupBy from "lodash.groupby";

import { Select, InputLabel, FormControl } from "@material-ui/core";
import { buildSeriesUrl, buildGeographicLevelsUrl } from "../api/odata";

import TimeseriesChart from "./TimeseriesChart";
import LineChartForm from "./LineChartForm";

export default function LineChartTerritories({ code, metadata }) {
  const [series, setSeries] = useState([]);
  const [geoLevels, setGeoLevels] = useState([]);
  const [geoLevel, setGeoLevel] = useState("");

  useEffect(() => {
    async function fetchValues() {
      const levelsUrl = buildGeographicLevelsUrl(code);
      const levelsResponse = await fetch(levelsUrl);
      const levelsJson = await levelsResponse.json();

      const allGeoLevels = levelsJson.value.map(level => level.NIVNOME);
      setGeoLevels(allGeoLevels);

      const selectedGeoLevel = allGeoLevels[0];
      setGeoLevel(selectedGeoLevel);

      const seriesUrl =
        buildSeriesUrl(code) + `&$filter=NIVNOME eq '${selectedGeoLevel}'`;

      console.log(JSON.stringify(seriesUrl));

      const seriesResponse = await fetch(seriesUrl);
      const seriesJson = await seriesResponse.json();

      setSeries(seriesJson.value);
    }

    fetchValues();
  }, [code]);

  const datasets = Object.entries(groupBy(series, "TERNOME")).map(
    ([level, values]) => ({
      label: level,
      data: values.map(series => series.VALVALOR)
    })
  );

  const labels = Array.from(new Set(series.map(series => series.VALDATA)));

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.elements);

    const { initialDate, finalDate, geographicLevel } = e.target.elements;

    console.log(initialDate.value, finalDate.value, geographicLevel.value);
  }

  return (
    <>
      <LineChartForm metadata={metadata} onSubmit={handleSubmit}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="geographicLevel">Nível geográfico</InputLabel>
          <Select
            native
            variant="outlined"
            value={geoLevel}
            onChange={e => setGeoLevel(e.target.value)}
            inputProps={{ name: "geographicLevel", id: "geographicLevel" }}
          >
            {geoLevels.map(level => (
              <option value={level}>{level}</option>
            ))}
          </Select>
        </FormControl>
      </LineChartForm>

      <TimeseriesChart
        labels={labels}
        datasets={datasets}
        metadata={metadata}
      />
    </>
  );
}
