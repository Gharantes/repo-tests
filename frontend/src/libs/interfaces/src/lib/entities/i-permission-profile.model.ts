export interface IPermissionProfileModel {
  id: number;
  title: string;
  idPermissions: number[];
  /** Quantas contas têm este perfil. */
  accountCount: number;
}
