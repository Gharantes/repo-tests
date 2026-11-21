package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsEntities.models.PostDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class PostRowMapper : RowMapper<PostDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): PostDto {
        return PostDto(
            id = rs.getLong("id_post"),
            idAccount = rs.getLong("id_account"),
            authorName = rs.getString("post_author_name"),
            title = rs.getString("post_title"),
            content = rs.getString("post_content"),
            createdAt = rs.getTimestamp("post_created_at").toLocalDateTime(),
            updatedAt = rs.getTimestamp("post_updated_at").toLocalDateTime()
        )
    }
}
