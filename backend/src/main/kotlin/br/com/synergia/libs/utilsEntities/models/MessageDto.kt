package br.com.synergia.libs.utilsEntities.models

import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import java.time.LocalDateTime

/**
 * Mensagem. Com `joinRequestStatus`, é a apresentação de quem pediu para participar do projeto;
 * enquanto PENDING, `idJoinRequest` é o pedido que os membros aceitam ou recusam.
 */
data class MessageDto(
    val id: Long,
    val idConversation: Long,
    val idAccount: Long,
    val authorName: String,
    val content: String,
    val createdAt: LocalDateTime,
    val idJoinRequest: Long? = null,
    val joinRequestStatus: JoinRequestStatusEnum? = null
)
