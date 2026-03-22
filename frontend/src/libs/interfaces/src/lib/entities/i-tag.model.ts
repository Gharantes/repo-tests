export interface ITagModel {
  id: number;
  idTenant: number;
  title: string;
  forProjects: boolean;
  forEvents: boolean;
  forAccounts: boolean;
  createdAt: string;
  createdAtRaw: Date;
}