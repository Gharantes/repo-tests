export interface IUpsertProjectModel {
  title: string,
  description: string,
  urlBanner: string | null,
  tags: number[],
  idAccount: number,
  idTenant: number
}