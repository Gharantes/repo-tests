import {
  IDoRegistrarEvento,
} from '@synergia-frontend/interfaces';
import { CreateEventoDto, UpdateEventoDto } from '@synergia-frontend/api';

export function mapFromCreateEventoDtoToIDoRegistrarEvento(
  res: CreateEventoDto,
): IDoRegistrarEvento {
  return {
    title: res.title,
    description: res.description,
    urlBanner: res.urlBanner ?? null,
    tags: res.tags
  };
}

export function mapFromIDoRegistrarEventoToUpdateEventoDto(
  res: IDoRegistrarEvento,
  id: number,
  idTenant: number
): UpdateEventoDto {
  return {
    id,
    title: res.title,
    description: res.description,
    idTenant,
    urlBanner: res.urlBanner ?? undefined,
    tags: res.tags
  }
}

export function mapFromIDoRegistrarEventoToCreateEventoDto(
  $event: IDoRegistrarEvento,
  idTenant: number,
  idAccount: number,
): CreateEventoDto {
  return {
    title: $event.title,
    description: $event.description,
    idTenant: idTenant,
    idAccount: idAccount,
    urlBanner: $event.urlBanner ?? undefined,
    tags: $event.tags
  };
}