package com.example.synergia.repositories.attachments

import com.example.synergia.utils.enums.AttachmentTypeEnum
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import com.example.synergia.utils.models.attachments.InsertAttachmentDto
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import java.sql.Types

class InsertAttachmentSql (
    override val params: InsertAttachmentDto
) : ISqlUpdateStatement<InsertAttachmentDto> {
    companion object {
        fun ofImage(idTenant: Long, url: String?): InsertAttachmentSql? {
            return if (url.isNullOrBlank()) null else InsertAttachmentSql(
                InsertAttachmentDto(idTenant, AttachmentTypeEnum.IMAGE, url)
            )
        }
    }
    override val sql: String = """
        INSERT INTO attachments (
            id_tenant,
            attachment_type, 
            url
        ) values (
            :id_tenant,
            :type, 
            :url
        );
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("type", params.type.value, Types.INTEGER)
            .addValue("url", params.url, Types.VARCHAR)
    }

    fun returnId(template: NamedParameterJdbcTemplate): Long? {
        return executeStatementWithReturnKey(template, "id")?.toLong()
    }
}