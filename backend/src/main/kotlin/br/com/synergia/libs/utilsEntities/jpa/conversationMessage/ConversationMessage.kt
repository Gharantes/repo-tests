package br.com.synergia.libs.utilsEntities.jpa.conversationMessage

import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Mensagem de uma conversa. Com `joinRequestStatus` preenchido, é a apresentação de alguém que pediu
 * para participar do projeto (postada no grupo do projeto, mesmo a pessoa ainda não sendo membro).
 * `idJoinRequest` aponta para o pedido em project_join_request, que some quando é respondido; o
 * status fica aqui para o histórico.
 */
@Entity
@Table(
    name = "conversation_message",
    indexes = [
        Index(name = "ix_conversation_message_conversation", columnList = "id_conversation, id"),
        Index(name = "ix_conversation_message_join_request", columnList = "id_join_request"),
    ]
)
class ConversationMessage(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_conversation", nullable = false)
    val idConversation: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    val content: String = "",

    @Column(name = "id_join_request")
    val idJoinRequest: Long? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "join_request_status", length = 10)
    var joinRequestStatus: JoinRequestStatusEnum? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
