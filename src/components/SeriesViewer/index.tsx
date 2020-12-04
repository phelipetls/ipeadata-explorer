import React from "react";

import { useQuery } from "react-query";

import { useParams } from "react-router-dom";

import { Loading } from "../common/Loading";

import { ChartMacro } from "./Chart/Macro";
import { ChartGeographic } from "./Chart/Geographic";
import { ChartCategorical } from "./Chart/Categorical";
import { Metadata } from "./Metadata";

import { buildMetadataUrl } from "../api/odata";

async function fetchMetadata(_, code) {
  const url = buildMetadataUrl(code);
  return await (await fetch(url)).json();
}

export function SeriesViewer() {
  let { code } = useParams();

  const { isLoading, data } = useQuery(
    ["Fetch series metadata", code],
    fetchMetadata
  );

  const metadata = (data && data.value && data.value[0]) || {};

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Metadata metadata={metadata} />

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
