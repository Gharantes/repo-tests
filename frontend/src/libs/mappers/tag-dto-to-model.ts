import { TagDto } from '@synergia-frontend/api';
import { ITagModel } from '@synergia-frontend/interfaces';

export function TagDtoToModel (input: TagDto) : ITagModel {
  return {
    id: input.id,
    name: input.label
  }
}