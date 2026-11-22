package br.com.synergia.libs.utilsEntities.models

import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import java.time.LocalDateTime

/**
 * Conversa na lista da tela Mensagens, do ponto de vista de quem pediu a lista.
 * PROJECT traz o projeto; PROJECT_EVENT, o projeto e o evento; DIRECT, a outra pessoa.
 */
data class ConversationDto(
    val id: Long,
    val type: ConversationTypeEnum,
    val idProject: Long?,
    val projectTitle: String?,
    val idEvent: Long?,
    val eventTitle: String?,
    val idOtherAccount: Long?,
    val otherAccountName: String?,
    val lastMessageContent: String?,
    val lastMessageAuthorName: String?,
    val lastMessageAt: LocalDateTime?,
    val unreadCount: Int,
    val createdAt: LocalDateTime
)

/**
 * Participante de uma conversa. `origin` diz por que a pessoa está ali: PROJECT (membro do projeto)
 * ou EVENT (pessoa do evento adicionada ao grupo). Numa DIRECT, sempre null.
 */
data class ConversationMemberDto(
    val idAccount: Long,
    val name: String,
    val origin: NoteParentEnum?,
    val membershipLabel: String
)

/**
 * Pessoa com quem a conta pode abrir uma conversa privada, e por quê: colega de um projeto
 * (relation = PROJECT) ou membro de um evento em que um projeto seu está registrado (relation = EVENT).
 * A mesma pessoa aparece uma vez para cada projeto/evento em comum.
 */
data class MessageContactDto(
    val idAccount: Long,
    val name: String,
    val relation: NoteParentEnum,
    val parentId: Long,
    val parentTitle: String,
    val membershipLabel: String
)
