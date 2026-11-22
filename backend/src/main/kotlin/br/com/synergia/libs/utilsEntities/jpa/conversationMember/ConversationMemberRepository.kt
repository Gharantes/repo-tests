package br.com.synergia.libs.utilsEntities.jpa.conversationMember

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationMemberRepository : JpaRepository<ConversationMember, Long> {
    fun existsByIdConversationAndIdAccount(idConversation: Long, idAccount: Long): Boolean

    @Transactional
    fun deleteByIdConversationAndIdAccount(idConversation: Long, idAccount: Long)
}
