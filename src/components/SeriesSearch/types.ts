import { SeriesMetadata } from "../types";

export type RowFields = Pick<
  SeriesMetadata,
  "SERNOME" | "PERNOME" | "UNINOME" | "SERMINDATA" | "SERMAXDATA"
>;

export interface Row extends RowFields {
  [index: string]: string | null;
}

export interface Column {
  key: string;
  label: string;
  render?: (row: Row) => JSX.Element | number;
}
