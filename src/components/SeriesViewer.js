import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { buildMetadataUrl } from "../api/odata";

import LineChart from "./LineChart";
import SeriesMetadata from "./SeriesMetadata";
import ChartContainer from "./ChartContainer";

export default function SeriesViewer() {
  const [metadata, setMetadata] = useState({});

  let { code } = useParams();
  let url = buildMetadataUrl(code);

  useEffect(
    function fetchMetadata() {
      fetch(url)
        .then(response => response.json())
        .then(json => setMetadata(json.value[0]));
    },
    [url]
  );

  return (
    <>
      <SeriesMetadata metadata={metadata} />

      <ChartContainer>
        <LineChart code={code} metadata={metadata} />
      </ChartContainer>
    </>
  );
}
