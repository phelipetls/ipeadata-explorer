import React from "react";

import { useQuery } from "react-query";

import { useParams } from "react-router-dom";

import { ChartMacro } from "./ChartMacro";
import { Loading } from "./Loading";
import { ChartGeographic } from "./ChartGeographic";
import { ChartCategorical } from "./ChartCategorical";
import { SeriesMetadata } from "./SeriesMetadata";

import { buildMetadataUrl } from "../api/odata";

export function SeriesViewer() {
  let { code } = useParams();

  const { isLoading, data } = useQuery([code], async code => {
    const url = buildMetadataUrl(code);
    const response = await fetch(url);
    return await response.json();
  });

  const metadata = data?.value[0] || {};

  return isLoading ? (
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
