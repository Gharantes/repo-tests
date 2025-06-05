import { CreateProjetoDto, UpdateProjetoDto } from '@synergia-frontend/api';
import { IDoRegistrarProjeto } from '@synergia-frontend/interfaces';

export function mapFromCreateProjetoDtoToIDoRegistrarProjeto(
  el: CreateProjetoDto
): IDoRegistrarProjeto {
  return {
    title: el.title,
    description: el.description,
  }
}
export function mapFromIDoRegistrarProjetoToCreateProjetoDto(
  el: IDoRegistrarProjeto,
  idTenant: number
): CreateProjetoDto {
  return {
    idTenant: idTenant,
    title: el.title,
    description: el.description,
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
  }
}