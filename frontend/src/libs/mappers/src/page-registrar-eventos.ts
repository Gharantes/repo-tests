import {
  IDoListarEventos,
  IDoRegistrarEvento,
} from '@synergia-frontend/interfaces';
import { CreateEventoDto } from '@synergia-frontend/api';

export function mapFromListarEventosDtoToIDoRegistrarEvento(
  res: IDoListarEventos
): IDoRegistrarEvento {
  return {
    title: res.title,
    description: res.description,
    urlBanner: res.bannerUrl ?? null,
  };
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