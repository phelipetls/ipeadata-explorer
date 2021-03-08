import { geographicDivisions } from "./ibge";

// Possible values that the field NIVNOME from a series metadata may assume
export type GeographicDivision = typeof geographicDivisions[number];

// Divisions we want to visualize with a map
export type DivisionToPlotAsMap = Exclude<
  GeographicDivision,
  "Brasil" | "Regiões" | "Área metropolitana"
>;

// Divisions for which we have GeoJSON files available
export type IbgeMapDivision = Exclude<GeographicDivision, "Área metropolitana">;

// Geographic divisions to use as boundary for a map, e.g., to see states of
// southern region only. We cannot see any further geographical division
// further than a municipality.
export type BoundaryDivision = Exclude<IbgeMapDivision, "Municípios">;

// Divisions we need to fetch metadata about, e.g. to get every Brazil's
// regions or state for a user to select.
export type IbgeLocationDivision = Exclude<IbgeMapDivision, "Brasil">;
