export interface IUpsertEventModel {
  title: string,
  description: string,
  bannerUrl: string | undefined,
  idAccount: number,
  idTenant: number,
  tags: number[]
}