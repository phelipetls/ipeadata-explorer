import * as React from "react";

import axios from "redaxios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { Loading } from "components";
import {
  ChartMacro,
  ChartGeographic,
  ChartCategorical,
  Metadata,
} from "./components";

import { buildMetadataUrl } from "api/odata";

async function fetchMetadata(_: string, code: string) {
  const url = buildMetadataUrl(code);
  const response = await axios.get(url);
  return response.data;
}

export function SeriesViewer() {
  const { code } = useParams() as { code: string };

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
