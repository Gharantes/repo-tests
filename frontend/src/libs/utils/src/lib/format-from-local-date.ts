export function formatFromLocalDate(localdate: string) {
  if (localdate.split('-').length < 3) { return localdate; }

  const [year, month, day] = localdate.split('-');
  return `${day}/${month}/${year}`;
}