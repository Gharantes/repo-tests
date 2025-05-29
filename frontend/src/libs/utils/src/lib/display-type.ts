export type DisplayType = 'TABLE' | 'GRID';

export function toggleDisplayType(displayType: DisplayType): DisplayType {
  if (displayType == 'TABLE') { return 'GRID'; }
  else { return 'TABLE'; }
}