package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.models.FeedItemDto
import br.com.synergia.libs.utilsEntities.models.NoteItemDto
import org.springframework.jdbc.core.RowMapper
import tools.jackson.module.kotlin.jacksonObjectMapper
import tools.jackson.module.kotlin.readValue
import java.sql.ResultSet

class FeedItemRowMapper : RowMapper<FeedItemDto> {
    private val json = jacksonObjectMapper()

    override fun mapRow(rs: ResultSet, rowNum: Int): FeedItemDto {
        return FeedItemDto(
            type = ActivityTypeEnum.valueOf(rs.getString("feed_type")),
            referenceId = rs.getLong("feed_reference_id"),
            parentEntity = NoteParentEnum.valueOf(rs.getString("feed_parent_entity")),
            parentId = rs.getLong("feed_parent_id"),
            parentTitle = rs.getString("feed_parent_title"),
            idAccount = rs.getLong("id_account"),
            authorName = rs.getString("feed_author_name"),
            authorIsLead = rs.getBoolean("feed_author_is_lead"),
            title = rs.getString("feed_title"),
            content = rs.getString("feed_content"),
            items = json.readValue<List<NoteItemDto>>(rs.getString("feed_items")),
            createdAt = rs.getTimestamp("feed_created_at").toLocalDateTime()
        )
    }
}
