import { ListarTagDto } from '@synergia-frontend/api';
import { IDoListarTags } from '@synergia-frontend/interfaces';
import { formatFromTimestamp } from '@synergia-frontend/utils';


export function listarTagsDtoToIDoArray(res: ListarTagDto[]): IDoListarTags[] {
  return res.map(v => listarTagsDtoToIDo(v));
}
function listarTagsDtoToIDo(res: ListarTagDto): IDoListarTags {
  return {
    id: res.id,
    name: res.name,
    createdAt: formatFromTimestamp(res.createdAt)
  };
}