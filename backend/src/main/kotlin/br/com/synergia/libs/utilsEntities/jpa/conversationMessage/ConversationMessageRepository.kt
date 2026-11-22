package br.com.synergia.libs.utilsEntities.jpa.conversationMessage

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationMessageRepository : JpaRepository<ConversationMessage, Long> {
    fun findFirstByIdConversationOrderByIdDesc(idConversation: Long): ConversationMessage?
}
