/** Textos e ícones dos avisos, usados no sino e no dashboard. */
type Activity = 'POST' | 'NOTE' | 'LIST' | 'DATE' | 'REQUEST' | 'ACCEPTED';

const ICONS: Record<Activity, string> = {
  POST: 'forum',
  NOTE: 'sticky_note_2',
  LIST: 'checklist',
  DATE: 'event',
  REQUEST: 'person_add',
  ACCEPTED: 'how_to_reg',
};

/** Completa "<autor> ... <evento/projeto>". */
const VERBS: Record<Activity, string> = {
  POST: 'publicou no feed de',
  NOTE: 'criou uma nota em',
  LIST: 'criou uma lista em',
  DATE: 'marcou uma data em',
  REQUEST: 'pediu para participar de',
  ACCEPTED: 'aceitou seu pedido para participar de',
};

export function activityIcon(type: Activity) {
  return ICONS[type];
}
export function activityVerb(type: Activity) {
  return VERBS[type];
}