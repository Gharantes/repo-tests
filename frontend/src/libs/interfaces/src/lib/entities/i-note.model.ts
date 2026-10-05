export type NoteType = 'TEXT' | 'LIST';
export type NoteParent = 'PROJECT' | 'EVENT';

export interface INoteItem {
  text: string;
  done: boolean;
}

export interface INoteModel {
  id: number;
  idAccount: number;
  authorName: string;
  type: NoteType;
  title: string;
  content: string;
  items: INoteItem[];
  color: string;
  pinned: boolean;
  archivedAt: string | null;
  updatedAt: string;
  parentEntity: NoteParent | null;
  parentId: number | null;
  parentTitle: string | null;
}

export interface IUpsertNote {
  idTenant: number;
  idAccount: number;
  type: NoteType;
  title: string;
  content: string;
  items: INoteItem[];
  color: string;
  pinned: boolean;
  archived: boolean;
}
