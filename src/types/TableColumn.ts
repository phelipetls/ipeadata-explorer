export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: "date" | "string" | "number";
  render?: (row: any) => JSX.Element | number | string;
}
