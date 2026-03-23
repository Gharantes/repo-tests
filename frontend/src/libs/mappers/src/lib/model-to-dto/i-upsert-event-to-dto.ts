import { IUpsertEventModel } from '@synergia-frontend/interfaces';
import { UpsertEventDto } from '@synergia-frontend/api';

export function IUpsertEventToDto (input: IUpsertEventModel): UpsertEventDto {
  return {
    title: input.title,
    description: input.description,
    idAccount: input.idAccount,
    idTenant: input.idTenant,
    tags: input.tags
  }

}