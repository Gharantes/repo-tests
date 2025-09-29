package com.example.synergia.services.byPage

import com.example.synergia.repositories.byDomain.AccountRepository
import com.example.synergia.repositories.byPage.pageListarUsuarios.ListarUsuariosAllSql
import com.example.synergia.models.byPage.pageListarUsuarios.dto.input.FiltroListarUsuariosAllDto
import com.example.synergia.models.byPage.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarUsuariosService (
    private val template: NamedParameterJdbcTemplate,
    private val accountRepository: AccountRepository
) {
    fun listarUsuariosAll(
        params: FiltroListarUsuariosAllDto
    ): List<ListarUsuariosBasicInfoDto> =
        ListarUsuariosAllSql(params).query(template)

    fun deletarUsuario(id: Long) {
        val accountEntity = accountRepository.findById(id).get()
        // TODO: Permitir deletar ADMIN caso exista outra conta com permissões ADMIN
        if (accountEntity.login == "ADMIN") {
            throw Exception("Não é permitido deletar conta ADMIN")
        }
        accountRepository.deleteById(id)
    }
}