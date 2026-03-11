import { PermissionDto } from '@synergia-frontend/api';
import { IPermissionModel } from '@synergia-frontend/interfaces';

export function PermissionDtoToModel(input: PermissionDto) : IPermissionModel {
  return {
    id: input.id,
    name: input.name
  }
}