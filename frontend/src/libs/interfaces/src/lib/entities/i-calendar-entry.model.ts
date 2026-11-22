/** Dono de uma data do calendário. */
export type CalendarParent = 'PROJECT' | 'EVENT';

/**
 * Data do calendário. `date` vem como "2026-12-05" (sem hora). No calendário do projeto vêm
 * também as datas dos eventos em que ele está registrado: `parentEntity` diz de onde cada uma é.
 */
export interface ICalendarEntryModel {
  id: number;
  idAccount: number;
  authorName: string;
  date: string;
  title: string;
  description: string;
  parentEntity: CalendarParent;
  parentId: number;
  parentTitle: string;
  updatedAt: string;
}

/** O que o diálogo de data devolve. `date` no formato "2026-12-05". */
export interface ICalendarEntryDraft {
  date: string;
  title: string;
  description: string;
}
