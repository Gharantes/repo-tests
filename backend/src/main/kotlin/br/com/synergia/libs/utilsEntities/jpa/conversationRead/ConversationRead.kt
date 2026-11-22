package br.com.synergia.libs.utilsEntities.jpa.conversationRead

import jakarta.persistence.*

/** Até qual mensagem a conta já leu a conversa. Sem linha, nada foi lido. */
@Entity
@Table(
    name = "conversation_read",
    uniqueConstraints = [UniqueConstraint(name = "uq_conversation_read", columnNames = ["id_conversation", "id_account"])]
)
class ConversationRead(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_conversation", nullable = false)
    val idConversation: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "last_read_message_id", nullable = false)
    var lastReadMessageId: Long = 0L
)
