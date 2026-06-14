import { ITagModel } from './i-tag.model';

export interface IAccountModel {
  id: number;
  login: string;
  email: string|undefined;
  firstName: string;
  lastName: string;
  tags: ITagModel[];
}