export interface IDoExtendableTableColumnInfo <T> {
  def: string;
  header: string;
  value: (element: T) => unknown;
  special?: string;
}