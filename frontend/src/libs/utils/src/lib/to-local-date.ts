/** Date → "2026-12-05" no fuso do navegador (toISOString mudaria o dia perto da meia-noite). */
export function toLocalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
