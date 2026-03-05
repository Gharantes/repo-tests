package br.com.synergia.pageListUsuarios.services

import br.com.synergia.pageListUsuarios.models.FiltroListarUsuariosAllDto
import br.com.synergia.pageListUsuarios.models.ListarUsuariosBasicInfoDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListUsuariosSqlService (
    private val template: NamedParameterJdbcTemplate,
) {
    fun listarUsuarios(idTenant: Long): List<ListarUsuariosBasicInfoDto> {
        val sql = SqlPath.PageListUsuarios.LISTAR_USUARIOS.load()
        val paramMap = MapSqlParameterSource().addValue("id_tenant", idTenant, Types.BIGINT)
        return template.query(sql, paramMap) { rs, _ ->
            ListarUsuariosBasicInfoDto(
                idAccount = rs.getLong("id"),
                idPerson = rs.getLong("id_person").takeUnless { rs.wasNull() },
                login = rs.getString("login"),
                firstName = rs.getString("first_name"),
                lastName = rs.getString("last_name")
            )
        }
    }

    fun deletarUsuario(idUsuario: Long) {

    }
}