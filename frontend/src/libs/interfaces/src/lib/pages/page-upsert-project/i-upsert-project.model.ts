export interface IUpsertProjectModel {
  title: string,
  description: string,
  bannerUrl: string | undefined,
  tags: number[],
  idAccount: number,
  idTenant: number
}