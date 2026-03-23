import { TagDto } from '@synergia-frontend/api';
import { ITagModel } from '@synergia-frontend/interfaces';
import { formatFromLocalDate, parseFromLocalDate } from '@synergia-frontend/utils';

export function TagDtoToModel (input: TagDto) : ITagModel {
  return {
    id: input.id,
    idTenant: input.idTenant,
    title: input.title,
    forAccounts: input.forAccounts,
    forEvents: input.forEvents,
    forProjects: input.forProjects,
    createdAt: formatFromLocalDate(input.createdAt),
    createdAtRaw: parseFromLocalDate(input.createdAt)
  }
}