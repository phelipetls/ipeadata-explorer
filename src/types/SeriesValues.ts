import { GeographicDivision } from "api/ibge/types";

export interface SeriesValuesMacro {
  /**
   * Date (ISO 8601)
   */
  VALDATA: string;
  /**
   * Value
   */
  VALVALOR: number;
  /**
   * Geographic division
   */
  NIVNOME: GeographicDivision;
}

export interface SeriesValuesGeographic extends SeriesValuesMacro {
  /**
   * Territory name within a geographic division
   */
  TERCODIGO: string;
  /**
   * Territory identifier code within a geographic division
   */
  TERNOME: string;
}

export interface SeriesValuesCategorical {
  /**
   * Category value
   */
  VALVALOR: string;
  /**
   * Total number of observations
   */
  count: number;
}
