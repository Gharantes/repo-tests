import { PermissionProfileDto } from '@synergia-frontend/api';
import { IPermissionProfileModel } from '@synergia-frontend/interfaces';

export function PermissionProfileDtoToModel(input: PermissionProfileDto): IPermissionProfileModel {
  return {
    id: input.id,
    title: input.title,
    idPermissions: input.idPermissions ?? [],
    accountCount: input.accountCount ?? 0,
  };
}
