import { formatDateTime } from './format-date-time';

/** "agora", "há 5 min", "há 3 h", "há 2 d"; depois de uma semana, a data completa. */
export function formatRelativeTime(value: string, now: Date = new Date()) {
  const diffMin = Math.floor((now.getTime() - new Date(value).getTime()) / 60_000);
  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `há ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `há ${diffD} d`;
  return formatDateTime(value);
}
