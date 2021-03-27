export interface SeriesValuesMacro {
  VALDATA: string;
  VALVALOR: number;
}

export interface SeriesValuesGeographic extends SeriesValuesMacro {
  TERCODIGO: string;
  TERNOME: string;
}

export interface SeriesValuesCategorical {
  VALVALOR: string;
  count: number;
}
