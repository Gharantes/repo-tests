import { IUpsertAccountModel } from '@synergia-frontend/interfaces';
import { UpsertAccountDto } from '@synergia-frontend/api';

export function IUpsertAccountToDto(input: IUpsertAccountModel) : UpsertAccountDto {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    login: input.login,
    password: input.password,
    idTenant: input.idTenant,
    email: input.email
  }
}