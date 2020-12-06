export interface TableConfig {
  key: string;
  label: string;
  dataType: string;
  render?: (row: any) => JSX.Element | number | string;
}
