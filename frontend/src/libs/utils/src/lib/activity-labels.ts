/** Textos e ícones de postagem/nota/lista/data, usados no sino e no feed do dashboard. */
type Activity = 'POST' | 'NOTE' | 'LIST' | 'DATE';

const ICONS: Record<Activity, string> = {
  POST: 'forum',
  NOTE: 'sticky_note_2',
  LIST: 'checklist',
  DATE: 'event',
};

/** Completa "<autor> ... <evento/projeto>". */
const VERBS: Record<Activity, string> = {
  POST: 'publicou no feed de',
  NOTE: 'criou uma nota em',
  LIST: 'criou uma lista em',
  DATE: 'marcou uma data em',
};

export function activityIcon(type: Activity) {
  return ICONS[type];
}
export function activityVerb(type: Activity) {
  return VERBS[type];
}