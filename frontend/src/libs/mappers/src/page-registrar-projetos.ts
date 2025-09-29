import { CreateProjetoDto, UpdateProjetoDto } from '@synergia-frontend/api';
import { IDoRegistrarProjeto } from '@synergia-frontend/interfaces';

export function mapFromCreateProjetoDtoToIDoRegistrarProjeto(
  el: CreateProjetoDto
): IDoRegistrarProjeto {
  return {
    title: el.title,
    description: el.description,
    urlBanner: el.urlBanner ?? null,
    tags: el.tags
  }
}
export function mapFromIDoRegistrarProjetoToCreateProjetoDto(
  el: IDoRegistrarProjeto,
  idTenant: number,
  idAccount: number
): CreateProjetoDto {
  return {
    idTenant: idTenant,
    idAccount: idAccount,
    title: el.title,
    description: el.description,
    urlBanner: el.urlBanner ?? undefined,
    tags: el.tags
  }
}
export function mapFromIDoRegistrarProjetoToUpdateProjetoDto(
  el: IDoRegistrarProjeto,
  id: number,
  idTenant: number
): UpdateProjetoDto {
  return {
    id,
    idTenant,
    title: el.title,
    description: el.description,
    urlBanner: el.urlBanner ?? undefined,
    tags: el.tags
  }
}