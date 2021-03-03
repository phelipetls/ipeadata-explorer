import { buildMetadataUrl } from "api/odata";
import { EmptyState, Loading } from "components";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "redaxios";
import {
  ChartCategorical,
  ChartGeographic,
  ChartMacro,
  Metadata,
} from "./components";

async function fetchMetadata(code: string) {
  const url = buildMetadataUrl(code);
  const response = await axios.get(url);
  return response.data;
}

export function SeriesViewer() {
  const { code } = useParams() as { code: string };

  const { isLoading, isError, data } = useQuery(
    ["Fetch series metadata", code],
    () => fetchMetadata(code)
  );

  const metadata = data?.value?.[0] || {};

  return isLoading ? (
    <Loading />
  ) : isError ? (
    <EmptyState text="Desculpe, algum erro ocorreu." />
  ) : isEmpty(metadata) ? (
    <EmptyState text="Série não existente." />
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
