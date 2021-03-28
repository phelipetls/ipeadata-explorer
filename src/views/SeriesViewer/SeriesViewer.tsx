import { fetchMetadata } from "api/ipea";
import { EmptyState, Loading, SeriesSection } from "components";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  CategoricalSeries,
  GeographicSeries,
  MacroSeries,
  Metadata,
} from "./components";

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

      <SeriesSection>
        {!metadata.SERNUMERICA ? (
          <CategoricalSeries code={code} metadata={metadata} />
        ) : metadata.BASNOME === "Macroeconômico" ? (
          <MacroSeries code={code} metadata={metadata} />
        ) : (
          <GeographicSeries code={code} metadata={metadata} />
        )}
      </SeriesSection>
    </>
  );
}

export default SeriesViewer;
