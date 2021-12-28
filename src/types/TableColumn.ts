export interface TableColumn<T> {
  accessor: keyof T
  label: string
  type?: 'date' | 'string' | 'number'
  render?: (row: T) => JSX.Element | number | string
}
