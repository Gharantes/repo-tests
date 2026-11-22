import { INoteItem, NoteParent } from './i-note.model';

/** O que aconteceu num evento/projeto: postagem no feed, nota ou lista na lousa. */
export type ActivityType = 'POST' | 'NOTE' | 'LIST';

/** Aviso do sino do topo. */
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

/** Item do feed "Novidades" do dashboard. `content` é Markdown nas postagens e texto puro nas notas. */
export interface IFeedItemModel {
  type: ActivityType;
  referenceId: number;
  parentEntity: NoteParent;
  parentId: number;
  parentTitle: string;
  idAccount: number;
  authorName: string;
  authorIsLead: boolean;
  title: string;
  content: string;
  items: INoteItem[];
  createdAt: string;
}
