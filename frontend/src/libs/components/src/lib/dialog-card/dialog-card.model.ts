import { IAccountModel, IEventModel, IProjectModel } from '@synergia-frontend/interfaces';

/** Qual entidade o card mostra. Decide textos, ícones, ações e qual endpoint busca os detalhes. */
export type DialogCardType = 'project' | 'event';

/** Projeto e evento têm o mesmo formato; o card trata os dois igual. */
export type DialogCardEntity = IProjectModel | IEventModel;

export interface DialogCardData {
  type: DialogCardType;
  entity: DialogCardEntity;
}

export type DialogCardAction = 'open' | 'edit' | 'register' | 'close';

/** Tudo que o card precisa para ser desenhado, já resolvido para o tipo. */
export interface DialogCardView {
  type: DialogCardType;
  entity: DialogCardEntity;
  kindLabel: string;
  kindIcon: string;
  bannerBg: string;
  monogram: string;
  openLabel: string;
  editLabel: string;
  registerLabel: string;
  registerIcon: string;
  emptyDescription: string;
  emptyMembers: string;
}

const LABELS: Record<
  DialogCardType,
  Pick<DialogCardView, 'kindLabel' | 'kindIcon' | 'openLabel' | 'editLabel' | 'registerLabel' | 'registerIcon' | 'emptyDescription' | 'emptyMembers'>
> = {
  project: {
    kindLabel: 'Projeto',
    kindIcon: 'rocket_launch',
    openLabel: 'Abrir projeto',
    editLabel: 'Editar',
    registerLabel: 'Registrar em evento',
    registerIcon: 'event_available',
    emptyDescription: 'Este projeto ainda não tem descrição.',
    emptyMembers: 'Nenhum membro no projeto.',
  },
  event: {
    kindLabel: 'Evento',
    kindIcon: 'event',
    openLabel: 'Abrir evento',
    editLabel: 'Editar',
    registerLabel: 'Registrar projeto',
    registerIcon: 'add_task',
    emptyDescription: 'Este evento ainda não tem descrição.',
    emptyMembers: 'Nenhum membro no evento.',
  },
};

/** Mesma paleta das listagens, para o card manter as cores que o usuário viu no grid. */
const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

export function colorForId(id: number): string {
  return PALETTE[Math.abs(id) % PALETTE.length];
}

export function memberInitials(a: IAccountModel): string {
  return ((a.firstName?.[0] ?? a.login?.[0] ?? '') + (a.lastName?.[0] ?? '')).toUpperCase();
}

export function memberName(a: IAccountModel): string {
  return [a.firstName, a.lastName].filter(Boolean).join(' ') || a.login;
}

export function buildDialogCardView(type: DialogCardType, entity: DialogCardEntity): DialogCardView {
  return {
    type,
    entity,
    ...LABELS[type],
    bannerBg: entity.bannerColor || colorForId(entity.id),
    monogram: (entity.title?.trim()?.[0] ?? '#').toUpperCase(),
  };
}
