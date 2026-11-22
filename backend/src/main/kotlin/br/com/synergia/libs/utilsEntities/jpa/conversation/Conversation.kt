package br.com.synergia.libs.utilsEntities.jpa.conversation

import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Conversa da tela Mensagens. `uniqueKey` impede duplicatas: só existe um grupo por projeto
 * ("PROJECT:12"), um por projeto+evento ("PROJECT_EVENT:12:7") e uma conversa privada por par
 * de contas ("DIRECT:3:9", menor id primeiro).
 */
@Entity
@Table(
    name = "conversation",
    uniqueConstraints = [UniqueConstraint(name = "uq_conversation_unique_key", columnNames = ["unique_key"])]
)
class Conversation(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    val type: ConversationTypeEnum = ConversationTypeEnum.DIRECT,

    /** PROJECT e PROJECT_EVENT. */
    @Column(name = "id_project")
    val idProject: Long? = null,

    /** Só PROJECT_EVENT. */
    @Column(name = "id_event")
    val idEvent: Long? = null,

    @Column(name = "unique_key", nullable = false, length = 100)
    val uniqueKey: String = "",

    @Column(name = "id_account_creator", nullable = false)
    val idAccountCreator: Long = 0L,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    companion object {
        fun projectKey(idProject: Long) = "PROJECT:$idProject"
        fun projectEventKey(idProject: Long, idEvent: Long) = "PROJECT_EVENT:$idProject:$idEvent"
        fun directKey(idA: Long, idB: Long) = "DIRECT:${minOf(idA, idB)}:${maxOf(idA, idB)}"
    }
}
