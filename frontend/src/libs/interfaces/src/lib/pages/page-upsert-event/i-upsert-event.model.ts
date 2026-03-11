export interface IUpsertEventModel {
  title: string,
  description: string,
  urlBanner: string | null,
  idAccount: number,
  idTenant: number,
  tags: number[]
}