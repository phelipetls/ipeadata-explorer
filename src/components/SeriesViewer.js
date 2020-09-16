import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { buildMetadataUrl } from "../api/odata";

import ChartMacro from "./ChartMacro";
import Loading from "./Loading";
import ChartGeographic from "./ChartGeographic";
import SeriesMetadata from "./SeriesMetadata";

export default function SeriesViewer() {
  const [metadata, setMetadata] = useState(null);

  let { code } = useParams();

  useEffect(() => {
    fetch(buildMetadataUrl(code))
      .then(response => response.json())
      .then(json => setMetadata(json.value[0]));
  }, [code]);

  return !metadata ? (
    <Loading style={{ minHeight: 512 }} />
  ) : (
    <>
      <SeriesMetadata metadata={metadata} />

      {metadata.BASNOME === "Macroeconômico" ? (
        <ChartMacro code={code} metadata={metadata} />
      ) : (
        <ChartGeographic code={code} metadata={metadata} />
      )}
    </>
  );
}
