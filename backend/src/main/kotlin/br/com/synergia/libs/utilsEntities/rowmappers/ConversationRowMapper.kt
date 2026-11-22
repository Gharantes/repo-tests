package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.models.ConversationDto
import br.com.synergia.libs.utilsEntities.models.ConversationMemberDto
import br.com.synergia.libs.utilsEntities.models.MessageContactDto
import br.com.synergia.libs.utilsEntities.models.MessageDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

private fun ResultSet.getLongOrNull(column: String): Long? = getObject(column)?.let { (it as Number).toLong() }

class ConversationRowMapper : RowMapper<ConversationDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): ConversationDto {
        return ConversationDto(
            id = rs.getLong("id_conversation"),
            type = ConversationTypeEnum.valueOf(rs.getString("conversation_type")),
            idProject = rs.getLongOrNull("id_project"),
            projectTitle = rs.getString("project_title"),
            idEvent = rs.getLongOrNull("id_event"),
            eventTitle = rs.getString("event_title"),
            idOtherAccount = rs.getLongOrNull("id_other_account"),
            otherAccountName = rs.getString("other_account_name"),
            lastMessageContent = rs.getString("last_message_content"),
            lastMessageAuthorName = rs.getString("last_message_author_name"),
            lastMessageAt = rs.getTimestamp("last_message_at")?.toLocalDateTime(),
            unreadCount = rs.getInt("unread_count"),
            createdAt = rs.getTimestamp("conversation_created_at").toLocalDateTime()
        )
    }
}

class MessageRowMapper : RowMapper<MessageDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): MessageDto {
        return MessageDto(
            id = rs.getLong("id_message"),
            idConversation = rs.getLong("id_conversation"),
            idAccount = rs.getLong("id_account"),
            authorName = rs.getString("message_author_name"),
            content = rs.getString("message_content"),
            createdAt = rs.getTimestamp("message_created_at").toLocalDateTime(),
            idJoinRequest = rs.getLongOrNull("id_join_request"),
            joinRequestStatus = rs.getString("join_request_status")?.let { JoinRequestStatusEnum.valueOf(it) }
        )
    }
}

class ConversationMemberRowMapper : RowMapper<ConversationMemberDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): ConversationMemberDto {
        return ConversationMemberDto(
            idAccount = rs.getLong("id_account"),
            name = rs.getString("member_name"),
            origin = rs.getString("member_origin")?.let { NoteParentEnum.valueOf(it) },
            membershipLabel = rs.getString("membership_label") ?: ""
        )
    }
}

class MessageContactRowMapper : RowMapper<MessageContactDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): MessageContactDto {
        return MessageContactDto(
            idAccount = rs.getLong("id_account"),
            name = rs.getString("contact_name"),
            relation = NoteParentEnum.valueOf(rs.getString("contact_relation")),
            parentId = rs.getLong("contact_parent_id"),
            parentTitle = rs.getString("contact_parent_title"),
            membershipLabel = rs.getString("membership_label") ?: ""
        )
    }
}
