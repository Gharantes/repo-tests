import { IUpsertProjectModel } from '@synergia-frontend/interfaces';
import { UpsertProjectDto } from '@synergia-frontend/api';

export function IUpsertProjectToDto(input: IUpsertProjectModel): UpsertProjectDto {
  return {
    title: input.title,
    tags: input.tags,
    description: input.description,
    idAccount: input.idAccount,
    idTenant: input.idTenant,
    bannerUrl: input.bannerUrl
  }
}