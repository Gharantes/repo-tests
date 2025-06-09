import { IDoCardGrid, IDoListarEventos } from '@synergia-frontend/interfaces';
import { ListarEventosDto } from '@synergia-frontend/api';
import { getRandomColor } from '@synergia-frontend/utils';

export function mapFromListarEventosDtoToIDoListarEventosArray(
  res: ListarEventosDto[]
): IDoListarEventos[] {
  return res.map(v => mapFromListarEventosDtoToIDoListarEventos(v));
}
export function mapFromIDoListarEventosToIDoCardGridArray(
  res: IDoListarEventos[]
): IDoCardGrid[] {
  return res.map(v => mapFromIDoListarEventosToIDoCardGrid(v));
}

export function mapFromListarEventosDtoToIDoListarEventos(
  res: ListarEventosDto
): IDoListarEventos {
  return {
    id: res.id,
    bannerUrl: res.bannerUrl,
    createdByNameAccount: res.createdByNameAccount,
    title: res.title,
    createdByIdAccount: res.createdByIdAccount,
    description: res.description,
    userIsMember: res.userIsMember
  }
}
function mapFromIDoListarEventosToIDoCardGrid(
  res: IDoListarEventos
): IDoCardGrid {
  return {
    id: res.id,
    primary: res.title,
    secondary: res.createdByNameAccount,
    urlBanner: res.bannerUrl,
    backgroundColor: getRandomColor()
  }
}