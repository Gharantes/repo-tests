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
    urlBanner: res.urlBanner ?? undefined
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
    createdByIdAccount: idAccount,
    urlBanner: $event.urlBanner ?? undefined,
  };
}