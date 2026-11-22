package br.com.synergia.libs.utilsEntities.jpa.conversationMessage

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationMessageRepository : JpaRepository<ConversationMessage, Long> {
    fun findFirstByIdConversationOrderByIdDesc(idConversation: Long): ConversationMessage?
    fun findByIdJoinRequest(idJoinRequest: Long): ConversationMessage?

    @Transactional
    fun deleteByIdJoinRequest(idJoinRequest: Long)
}
