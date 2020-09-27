import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { buildMetadataUrl } from "../api/odata";

import ChartMacro from "./ChartMacro";
import Loading from "./Loading";
import ChartGeographic from "./ChartGeographic";
import ChartCategorical from "./ChartCategorical";
import SeriesMetadata from "./SeriesMetadata";

export default function SeriesViewer() {
  const [metadata, setMetadata] = useState(null);

  let { code } = useParams();

  useEffect(() => {
    async function fetchSeriesMetadata() {
      const response = await fetch(buildMetadataUrl(code));
      const json = await response.json();
      setMetadata(json.value[0]);
    }

    fetchSeriesMetadata();
  }, [code]);

  return !metadata ? (
    <Loading style={{ minHeight: 512 }} />
  ) : (
    <>
      <SeriesMetadata metadata={metadata} />

      {!metadata.SERNUMERICA ? (
        <ChartCategorical code={code} metadata={metadata} />
      ) : metadata.BASNOME === "Macroeconômico" ? (
        <ChartMacro code={code} metadata={metadata} />
      ) : (
        <ChartGeographic code={code} metadata={metadata} />
      )}
    </>
  );
}
