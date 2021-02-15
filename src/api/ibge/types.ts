// Possible values that the field NIVNOME from a series metadata may assume
export type GeographicDivision =
  | "Brasil"
  | "Área metropolitana"
  | "Regiões"
  | "Estados"
  | "Mesorregiões"
  | "Microrregiões"
  | "Municípios";

// Divisions for which we plot a map
export type DivisionToPlotAsMap = Exclude<
  GeographicDivision,
  "Brasil" | "Regiões" | "Área metropolitana"
>;

// Divisions we can use to divide a map
export type IbgeMapDivision = Exclude<GeographicDivision, "Área metropolitana">;

// Divisions we may use as a boundary
// Example: visualize a variable for every state in a region.
// Municipalities can be no further divided, so they are not interesting.
export type BoundaryDivision = Exclude<IbgeMapDivision, "Municípios">;

// Divisions we need to fetch metadata about.
// Example: Get every Brazil region to fill a select input.
export type IbgeLocationDivision = Exclude<IbgeMapDivision, "Brasil">;
