const backgroundList: string[] = [
  '#3E85C6',
  '#B4CDCD',
  '#F17274',
  '#C6E2FF',
]
export function getRandomColor() {
  const i = Math.floor(Math.random() * backgroundList.length);
  return backgroundList[i];
}