import { ProjectDto } from '@synergia-frontend/api';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { TagDtoToModel } from './tag-dto-to-model';
import { AccountDtoToModel } from './account-dto-to-model';

export function ProjectDtoToModel(res: ProjectDto): IProjectModel {
  const dto = res as any;
  return {
    id: res.id,
    bannerColor: res.bannerColor,
    title: res.title,
    bannerUrl: res.bannerUrl,
    description: res.description,
    tags: res.tags.map((t) => TagDtoToModel(t)),
    members: (dto.members ?? []).map((v: any) => AccountDtoToModel(v)),
  }
}