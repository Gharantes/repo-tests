import { IDoCardGrid } from '@synergia-frontend/interfaces';
import { CardGridEntryInteractionType } from './card-grid-entry-interaction-type';

export interface IDoCardGridEntryInteraction {
  entry: IDoCardGrid;
  interactionType: CardGridEntryInteractionType;
}