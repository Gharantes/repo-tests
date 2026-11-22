/** Textos e ícones de postagem/nota/lista, usados no sino e no feed do dashboard. */
type Activity = 'POST' | 'NOTE' | 'LIST';

const ICONS: Record<Activity, string> = {
  POST: 'forum',
  NOTE: 'sticky_note_2',
  LIST: 'checklist',
};

/** Completa "<autor> ... <evento/projeto>". */
const VERBS: Record<Activity, string> = {
  POST: 'publicou no feed de',
  NOTE: 'criou uma nota em',
  LIST: 'criou uma lista em',
};

const NAMES: Record<Activity, string> = {
  POST: 'Postagem',
  NOTE: 'Nota',
  LIST: 'Lista',
};

export function activityIcon(type: Activity) {
  return ICONS[type];
}
export function activityVerb(type: Activity) {
  return VERBS[type];
}
export function activityName(type: Activity) {
  return NAMES[type];
}
