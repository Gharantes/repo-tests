/** Paleta de cores do banner. Espelha o ColorsEnum do backend, que só aceita estes valores. */
export const BANNER_COLORS: ReadonlyArray<{ hex: string; label: string }> = [
  { hex: '#FFB3BA', label: 'Rosa' },
  { hex: '#FFD9B3', label: 'Pêssego' },
  { hex: '#FFFFB3', label: 'Amarelo' },
  { hex: '#B3FFB3', label: 'Menta' },
  { hex: '#B3D9FF', label: 'Azul-céu' },
  { hex: '#D9B3FF', label: 'Lavanda' },
  { hex: '#FFB3E6', label: 'Rosé' },
  { hex: '#B3FFF0', label: 'Água' },
  { hex: '#FFE4B3', label: 'Damasco' },
  { hex: '#C5B3FF', label: 'Pervinca' },
  { hex: '#B3FFCC', label: 'Verde-mar' },
  { hex: '#FF9E9E', label: 'Salmão' },
  { hex: '#9EC8FF', label: 'Centáurea' },
  { hex: '#FFDA9E', label: 'Manga' },
  { hex: '#9EFFDA', label: 'Turquesa' },
  { hex: '#FF9EDB', label: 'Orquídea' },
  { hex: '#9EBAFF', label: 'Campânula' },
  { hex: '#D4FF9E', label: 'Lima' },
  { hex: '#FFB59E', label: 'Terracota' },
  { hex: '#9EFFFF', label: 'Ciano' },
];

export function randomBannerColor(): string {
  return BANNER_COLORS[Math.floor(Math.random() * BANNER_COLORS.length)].hex;
}
