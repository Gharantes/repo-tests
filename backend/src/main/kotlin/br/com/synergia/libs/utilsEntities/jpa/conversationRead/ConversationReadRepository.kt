package br.com.synergia.libs.utilsEntities.jpa.conversationRead

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationReadRepository : JpaRepository<ConversationRead, Long> {
    fun findByIdConversationAndIdAccount(idConversation: Long, idAccount: Long): ConversationRead?
}
