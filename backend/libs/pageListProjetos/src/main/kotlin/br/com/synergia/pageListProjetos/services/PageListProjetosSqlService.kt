package br.com.synergia.pageListProjetos.services

import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsCommons.models.entities.ProjetoDto
import br.com.synergia.utilsCommons.objects.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListProjetosSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listarProjetos(
        idTenant: Long,
        idAccount: Long,
        text: String?
    ): List<ProjetoDto> {
        val sql = SqlPath.PageListProjetos.LISTAR_PROJETOS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projetoRowmapper)
    }

    fun deletarProjeto(idProjeto: Long) {
        val sql = SqlPath.PageListProjetos.DELETAR_PROJETO.load()
        val paramMap = MapSqlParameterSource().addValue("id-projeto", idProjeto, Types.BIGINT)
        template.update(sql, paramMap)
    }
}