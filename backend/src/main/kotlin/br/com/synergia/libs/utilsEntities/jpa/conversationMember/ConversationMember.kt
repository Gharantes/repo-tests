package br.com.synergia.libs.utilsEntities.jpa.conversationMember

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Quem participa de uma conversa além do que já vem do projeto: as duas pessoas de uma DIRECT
 * e as pessoas do evento adicionadas a uma PROJECT_EVENT. Membros do projeto não são gravados aqui.
 */
@Entity
@Table(
    name = "conversation_member",
    uniqueConstraints = [UniqueConstraint(name = "uq_conversation_member", columnNames = ["id_conversation", "id_account"])]
)
class ConversationMember(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_conversation", nullable = false)
    val idConversation: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    /** Quem adicionou (numa DIRECT, quem abriu a conversa). */
    @Column(name = "id_account_added_by", nullable = false)
    val idAccountAddedBy: Long = 0L,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
