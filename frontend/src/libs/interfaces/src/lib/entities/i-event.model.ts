import { ITagModel } from './i-tag.model';

export interface IEventModel {
  id: number;
  title: string;
  description: string;
  bannerUrl?: string;
  bannerColor: string;
  tags: ITagModel[]
}