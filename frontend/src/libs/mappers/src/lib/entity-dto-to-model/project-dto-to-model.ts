import { ProjectDto } from '@synergia-frontend/api';
import { IProjectModel } from '@synergia-frontend/interfaces';

export function ProjectDtoToModel(res: ProjectDto): IProjectModel {
  return {
    id: res.id,
    bannerColor: res.bannerColor,
    title: res.title,
    bannerUrl: res.bannerUrl,
    description: res.description
  }
}