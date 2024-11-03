export interface IDoExtentendableTableColumnInfo <T> {
  def: string;
  header: string;
  value: (element: T) => unknown;
}