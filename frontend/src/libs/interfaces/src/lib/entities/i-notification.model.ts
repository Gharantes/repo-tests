import { NoteParent } from './i-note.model';

/** O que aconteceu num evento/projeto: postagem no feed, nota ou lista na lousa. */
export type ActivityType = 'POST' | 'NOTE' | 'LIST';

/** Aviso do sino do topo e da seção "Notificações" do dashboard. */
export interface INotificationModel {
  id: number;
  type: ActivityType;
  parentEntity: NoteParent;
  parentId: number;
  parentTitle: string;
  referenceId: number;
  referenceTitle: string;
  actorName: string;
  createdAt: string;
  readAt: string | null;
}
