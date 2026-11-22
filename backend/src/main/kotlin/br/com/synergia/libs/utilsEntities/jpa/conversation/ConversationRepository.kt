package br.com.synergia.libs.utilsEntities.jpa.conversation

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConversationRepository : JpaRepository<Conversation, Long> {
    fun findByUniqueKey(uniqueKey: String): Conversation?
}
