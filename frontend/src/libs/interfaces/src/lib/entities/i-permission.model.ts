export interface IPermissionModel {
  id: number,
  /** Código da permissão (ex.: CREATE_TAG). */
  name: string,
  /** Texto exibido na tela. */
  description: string,
  category: string,
}
