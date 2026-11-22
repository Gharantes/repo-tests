import { NoteParent } from './i-note.model';

/**
 * O que aconteceu num evento/projeto: postagem no feed, nota ou lista na lousa, data no calendário,
 * pedido para participar de um projeto (REQUEST, `referenceId` é o pedido) e pedido aceito (ACCEPTED).
 */
export type ActivityType = 'POST' | 'NOTE' | 'LIST' | 'DATE' | 'REQUEST' | 'ACCEPTED';

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
