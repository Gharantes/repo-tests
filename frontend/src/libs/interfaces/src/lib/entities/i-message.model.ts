/**
 * Tipos de conversa da tela Mensagens.
 * - PROJECT: grupo do projeto (todo membro do projeto participa).
 * - PROJECT_EVENT: grupo de um projeto com um evento em que ele está registrado; os membros do
 *   projeto adicionam pessoas do evento (ex.: o Organizador).
 * - DIRECT: conversa privada entre duas pessoas.
 */
export type ConversationType = 'PROJECT' | 'PROJECT_EVENT' | 'DIRECT';

/** Conversa na lista, vista por quem está logado. */
export interface IConversationModel {
  id: number;
  type: ConversationType;
  idProject: number | null;
  projectTitle: string | null;
  idEvent: number | null;
  eventTitle: string | null;
  /** Só DIRECT: a outra pessoa. */
  idOtherAccount: number | null;
  otherAccountName: string | null;
  lastMessageContent: string | null;
  lastMessageAuthorName: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

/** Situação do pedido para participar que acompanha a apresentação de um futuro membro. */
export type JoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

/**
 * Mensagem. Com `joinRequestStatus`, é a apresentação de quem pediu para participar do projeto
 * (ainda não é membro); enquanto PENDING, `idJoinRequest` é o pedido a aceitar ou recusar.
 */
export interface IMessageModel {
  id: number;
  idConversation: number;
  idAccount: number;
  authorName: string;
  content: string;
  createdAt: string;
  idJoinRequest: number | null;
  joinRequestStatus: JoinRequestStatus | null;
}

/** Participante. `origin`: PROJECT (membro do projeto), EVENT (adicionado do evento), null numa DIRECT. */
export interface IConversationMemberModel {
  idAccount: number;
  name: string;
  origin: 'PROJECT' | 'EVENT' | null;
  membershipLabel: string;
}

/**
 * Pessoa com quem dá para abrir uma conversa privada, e de onde ela vem: um projeto em comum
 * (relation PROJECT) ou um evento em que um projeto seu está registrado (relation EVENT).
 * A mesma pessoa vem uma vez para cada projeto/evento em comum.
 */
export interface IMessageContactModel {
  idAccount: number;
  name: string;
  relation: 'PROJECT' | 'EVENT';
  parentId: number;
  parentTitle: string;
  membershipLabel: string;
}
