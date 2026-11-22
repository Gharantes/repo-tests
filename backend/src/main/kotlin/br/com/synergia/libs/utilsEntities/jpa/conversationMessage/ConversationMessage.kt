package br.com.synergia.libs.utilsEntities.jpa.conversationMessage

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "conversation_message",
    indexes = [Index(name = "ix_conversation_message_conversation", columnList = "id_conversation, id")]
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

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
