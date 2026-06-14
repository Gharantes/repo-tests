import { AccountDto } from '@synergia-frontend/api';
import { IAccountModel } from '@synergia-frontend/interfaces';
import { TagDtoToModel } from './tag-dto-to-model';

export function AccountDtoToModel (res: AccountDto) : IAccountModel {
  return {
    id: res.id,
    firstName: res.firstName,
    lastName: res.lastName,
    login: res.login,
    email: res.email,
    tags: (res.tags ?? []).map((t) => TagDtoToModel(t)),
  }
}