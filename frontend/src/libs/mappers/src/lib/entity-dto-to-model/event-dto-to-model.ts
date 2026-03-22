import { EventDto } from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';

export function EventDtoToModel (input: EventDto) : IEventModel {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    bannerColor: input.bannerColor,
    bannerUrl: input.bannerUrl
  }
}