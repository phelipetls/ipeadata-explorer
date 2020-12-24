import { SeriesMetadata } from "components/types";

export interface TableColumn<T = SeriesMetadata> {
  key: keyof T;
  label: string;
  type?: "date" | "string" | "numeric";
  render?: (row: any) => JSX.Element | number | string;
}
