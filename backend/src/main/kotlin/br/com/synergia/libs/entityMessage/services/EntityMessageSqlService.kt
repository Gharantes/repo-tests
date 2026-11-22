package br.com.synergia.libs.entityMessage.services

import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import br.com.synergia.libs.utilsEntities.jpa.conversation.Conversation
import br.com.synergia.libs.utilsEntities.jpa.conversation.ConversationRepository
import br.com.synergia.libs.utilsEntities.jpa.conversationMember.ConversationMember
import br.com.synergia.libs.utilsEntities.jpa.conversationMember.ConversationMemberRepository
import br.com.synergia.libs.utilsEntities.jpa.conversationMessage.ConversationMessage
import br.com.synergia.libs.utilsEntities.jpa.conversationMessage.ConversationMessageRepository
import br.com.synergia.libs.utilsEntities.jpa.conversationRead.ConversationRead
import br.com.synergia.libs.utilsEntities.jpa.conversationRead.ConversationReadRepository
import br.com.synergia.libs.utilsEntities.models.ConversationDto
import br.com.synergia.libs.utilsEntities.models.ConversationMemberDto
import br.com.synergia.libs.utilsEntities.models.MessageContactDto
import br.com.synergia.libs.utilsEntities.models.MessageDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityMessageSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val conversationRepository: ConversationRepository,
    private val memberRepository: ConversationMemberRepository,
    private val messageRepository: ConversationMessageRepository,
    private val readRepository: ConversationReadRepository
) {
    fun listConversations(idAccount: Long, idConversation: Long? = null): List<ConversationDto> {
        val sql = SqlPath.EntityMessage.LIST_CONVERSATIONS_OF_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("id_conversation", idConversation, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.conversationRowMapper)
    }

    /** Até [limit] mensagens, da mais antiga para a mais nova. */
    fun listMessages(idConversation: Long, afterId: Long?, beforeId: Long?, limit: Int): List<MessageDto> {
        val sql = SqlPath.EntityMessage.LIST_MESSAGES.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_conversation", idConversation, Types.BIGINT)
            .addValue("after_id", afterId, Types.BIGINT)
            .addValue("before_id", beforeId, Types.BIGINT)
            .addValue("limit", limit, Types.INTEGER)
        return template.query(sql, paramMap, EntityRowMapper.messageRowMapper).reversed()
    }

    fun listMembers(idConversation: Long): List<ConversationMemberDto> {
        val sql = SqlPath.EntityMessage.LIST_MEMBERS_OF_CONVERSATION.load()
        val paramMap = MapSqlParameterSource().addValue("id_conversation", idConversation, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.conversationMemberRowMapper)
    }

    fun listContacts(idAccount: Long): List<MessageContactDto> {
        val sql = SqlPath.EntityMessage.LIST_CONTACTS_OF_ACCOUNT.load()
        val paramMap = MapSqlParameterSource().addValue("id_account", idAccount, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.messageContactRowMapper)
    }

    fun getConversation(idConversation: Long): Conversation {
        return conversationRepository.findById(idConversation)
            .orElseThrow { NoSuchElementException("Conversa $idConversation não existe.") }
    }

    fun findConversation(uniqueKey: String): Conversation? = conversationRepository.findByUniqueKey(uniqueKey)

    fun createConversation(
        idTenant: Long,
        type: ConversationTypeEnum,
        uniqueKey: String,
        idCreator: Long,
        idProject: Long? = null,
        idEvent: Long? = null
    ): Conversation {
        return conversationRepository.save(
            Conversation(
                idTenant = idTenant,
                type = type,
                idProject = idProject,
                idEvent = idEvent,
                uniqueKey = uniqueKey,
                idAccountCreator = idCreator
            )
        )
    }

    fun isMember(idConversation: Long, idAccount: Long): Boolean =
        memberRepository.existsByIdConversationAndIdAccount(idConversation, idAccount)

    fun addMember(idConversation: Long, idAccount: Long, idAddedBy: Long) {
        if (isMember(idConversation, idAccount)) return
        memberRepository.save(ConversationMember(idConversation = idConversation, idAccount = idAccount, idAccountAddedBy = idAddedBy))
    }

    fun removeMember(idConversation: Long, idAccount: Long) {
        memberRepository.deleteByIdConversationAndIdAccount(idConversation, idAccount)
    }

    fun createMessage(
        idConversation: Long,
        idAccount: Long,
        content: String,
        idJoinRequest: Long? = null,
        joinRequestStatus: JoinRequestStatusEnum? = null
    ): ConversationMessage {
        return messageRepository.save(
            ConversationMessage(
                idConversation = idConversation,
                idAccount = idAccount,
                content = content,
                idJoinRequest = idJoinRequest,
                joinRequestStatus = joinRequestStatus
            )
        )
    }

    fun setJoinRequestStatus(idJoinRequest: Long, status: JoinRequestStatusEnum) {
        val message = messageRepository.findByIdJoinRequest(idJoinRequest) ?: return
        message.joinRequestStatus = status
        messageRepository.save(message)
    }

    fun deleteJoinRequestMessage(idJoinRequest: Long) {
        messageRepository.deleteByIdJoinRequest(idJoinRequest)
    }

    /** Marca como lido até a última mensagem da conversa. Nunca volta o marcador para trás. */
    fun markAsRead(idConversation: Long, idAccount: Long) {
        val lastId = messageRepository.findFirstByIdConversationOrderByIdDesc(idConversation)?.id ?: return
        val read = readRepository.findByIdConversationAndIdAccount(idConversation, idAccount)
            ?: ConversationRead(idConversation = idConversation, idAccount = idAccount)
        if (read.lastReadMessageId >= lastId) return
        read.lastReadMessageId = lastId
        readRepository.save(read)
    }
}
