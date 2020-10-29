import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { ChartMacro } from "./ChartMacro";
import { Loading } from "./Loading";
import { ChartGeographic } from "./ChartGeographic";
import { ChartCategorical } from "./ChartCategorical";
import { SeriesMetadata } from "./SeriesMetadata";

import { buildMetadataUrl } from "../api/odata";

export function SeriesViewer() {
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
    <Loading />
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

export default SeriesViewer;
