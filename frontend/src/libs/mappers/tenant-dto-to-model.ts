import { TenantDto } from '@synergia-frontend/api';
import { ITenantModel } from '@synergia-frontend/interfaces';

export function TenantDtoToModel (input: TenantDto) : ITenantModel {
  return {
    id: input.id,
    identifier: input.identifier,
    title: input.title
  }
}