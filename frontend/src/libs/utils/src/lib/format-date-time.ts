/** "2026-10-05T14:30:00" → "05/10/2026, 14:30" no fuso do navegador. */
export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
