package com.example.synergia.repositories.pageCreateProjeto

import com.example.synergia.rest.pageCreateProjeto.dto.input.UpdateProjetoDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class UpdateProjetoSql (
    override val params: UpdateProjetoDto,
    private val idBanner: Long?
) : ISqlUpdateStatement<UpdateProjetoDto> {
    override val sql: String = """
        UPDATE project SET
            title = :title,
            description = :description,
            id_banner = CASE
                WHEN id_banner IS NULL AND :id_banner IS NOT NULL THEN :id_banner
                ELSE id_banner END
        WHERE id = :id;
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        require(params.idTenant > 0L) {
            "Tenant Inválido"
        }
        require(params.title.isNotBlank()) {
            "Titúlo não pode estar vazio."
        }
        paramMap.addValue("id", params.id, Types.BIGINT)
        paramMap.addValue("title", params.title, Types.VARCHAR)
        paramMap.addValue("description", params.description, Types.VARCHAR)
        paramMap.addValue("id_banner", idBanner, Types.BIGINT)
    }
}