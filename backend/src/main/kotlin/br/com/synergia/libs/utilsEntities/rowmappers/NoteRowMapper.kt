package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.enums.NoteTypeEnum
import br.com.synergia.libs.utilsEntities.models.NoteDto
import br.com.synergia.libs.utilsEntities.models.NoteItemDto
import org.springframework.jdbc.core.RowMapper
import tools.jackson.module.kotlin.jacksonObjectMapper
import tools.jackson.module.kotlin.readValue
import java.sql.ResultSet

class NoteRowMapper : RowMapper<NoteDto> {
    private val json = jacksonObjectMapper()

    override fun mapRow(rs: ResultSet, rowNum: Int): NoteDto {
        return NoteDto(
            id = rs.getLong("id_note"),
            idAccount = rs.getLong("id_account"),
            authorName = rs.getString("note_author_name"),
            type = NoteTypeEnum.valueOf(rs.getString("note_type")),
            title = rs.getString("note_title"),
            content = rs.getString("note_content"),
            items = json.readValue<List<NoteItemDto>>(rs.getString("note_items")),
            color = rs.getString("note_color"),
            pinned = rs.getBoolean("note_pinned"),
            archivedAt = rs.getTimestamp("note_archived_at")?.toLocalDateTime(),
            updatedAt = rs.getTimestamp("note_updated_at").toLocalDateTime(),
            parentEntity = rs.getString("note_parent_entity")?.let { NoteParentEnum.valueOf(it) },
            parentId = rs.getObject("note_parent_id")?.let { (it as Number).toLong() },
            parentTitle = rs.getString("note_parent_title")
        )
    }
}
