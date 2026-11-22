package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.models.NotificationDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class NotificationRowMapper : RowMapper<NotificationDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): NotificationDto {
        return NotificationDto(
            id = rs.getLong("id_notification"),
            type = ActivityTypeEnum.valueOf(rs.getString("notification_type")),
            parentEntity = NoteParentEnum.valueOf(rs.getString("notification_parent_entity")),
            parentId = rs.getLong("notification_parent_id"),
            parentTitle = rs.getString("notification_parent_title"),
            referenceId = rs.getLong("notification_reference_id"),
            referenceTitle = rs.getString("notification_reference_title"),
            actorName = rs.getString("notification_actor_name"),
            createdAt = rs.getTimestamp("notification_created_at").toLocalDateTime(),
            readAt = rs.getTimestamp("notification_read_at")?.toLocalDateTime()
        )
    }
}
