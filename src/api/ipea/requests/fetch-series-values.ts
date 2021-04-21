import { GeographicDivision } from "api/ibge";
import axios from "redaxios";
import {
  IpeaApiResponse,
  SeriesMetadata,
  SeriesValuesCategorical,
  SeriesValuesMacro,
  SeriesValuesGeographic,
} from "types";
import {
  buildCountByCategoryUrl,
  buildFilter,
  buildSeriesValuesUrl,
  getBoundaryFilter,
  getDateFilter,
} from "..";

type Options = {
  code: string;
  startDate: Date | null;
  endDate: Date | null;
  lastN: number;
  metadata: SeriesMetadata;
};

type FetchValues<TParams, TResponse> = (
  options: TParams
) => Promise<IpeaApiResponse<TResponse[]>>;

export const fetchMacroValues: FetchValues<
  Options,
  SeriesValuesMacro
> = async ({ code, startDate, endDate, lastN, metadata }) => {
  const dateFilter = getDateFilter({
    start: startDate,
    end: endDate,
    lastN,
    metadata,
  });

  const url =
    buildSeriesValuesUrl(code, metadata.BASNOME) + buildFilter(dateFilter);

  const response = await axios.get(url);
  return response.data;
};

export const fetchCategoricalValues: FetchValues<
  Options,
  SeriesValuesCategorical
> = async ({ code, startDate, endDate, lastN, metadata }) => {
  const dateFilter = getDateFilter({
    start: startDate,
    end: endDate,
    lastN,
    metadata,
  });

  const url = buildCountByCategoryUrl(code, { filter: dateFilter });

  const response = await axios.get(url);
  return response.data;
};

type GeographicOptions = Options & {
  division: GeographicDivision;
  boundaryId: string;
};

export const fetchGeographicValues: FetchValues<
  GeographicOptions,
  SeriesValuesGeographic
> = async ({
  code,
  startDate,
  endDate,
  lastN,
  division,
  boundaryId,
  metadata,
}) => {
  const dateFilter = getDateFilter({
    start: startDate,
    end: endDate,
    lastN,
    metadata,
  });

  const boundaryFilter = getBoundaryFilter(boundaryId, division!);
  const divisionFilter = `NIVNOME eq '${division}'`;

  const url =
    buildSeriesValuesUrl(code, metadata.BASNOME) +
    buildFilter(dateFilter, divisionFilter, boundaryFilter);

  const response = await axios.get(url);
  return response.data;
};
