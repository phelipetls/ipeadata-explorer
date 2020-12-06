import { SeriesMetadata } from "components/types";

type RowFields = Pick<
  SeriesMetadata,
  "SERNOME" | "PERNOME" | "UNINOME" | "SERMINDATA" | "SERMAXDATA"
>;

export interface Row extends RowFields {
  [index: string]: string | null;
}
