import { ITagModel } from './i-tag.model';
import { IAccountModel } from './i-account.model';

export interface IEventModel {
  id: number;
  title: string;
  description: string;
  bannerUrl?: string;
  bannerColor: string;
  tags: ITagModel[];
  members: IAccountModel[];
}