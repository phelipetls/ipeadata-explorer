import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { buildMetadataUrl } from "../api/odata";

import LineChart from "./LineChart";
import LineChartTerritories from "./LineChartTerritories";
import SeriesMetadata from "./SeriesMetadata";
import ChartSection from "./ChartSection";

export default function SeriesViewer() {
  const [metadata, setMetadata] = useState(null);

  let { code } = useParams();

  useEffect(() => {
    fetch(buildMetadataUrl(code))
      .then(response => response.json())
      .then(json => setMetadata(json.value[0]));
  }, [code]);

  if (metadata === null) return null;

  return (
    <>
      <SeriesMetadata metadata={metadata} />

      <ChartSection>
        {metadata.BASNOME === "Regional" ? (
          <LineChartTerritories code={code} metadata={metadata} />
        ) : (
          <LineChart code={code} metadata={metadata} />
        )}
      </ChartSection>
    </>
  );
}
