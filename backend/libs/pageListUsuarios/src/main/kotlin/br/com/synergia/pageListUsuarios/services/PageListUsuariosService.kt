package br.com.synergia.pageListUsuarios.services

import br.com.synergia.pageListUsuarios.models.ListarUsuariosBasicInfoDto
import org.springframework.stereotype.Service

@Service
class PageListUsuariosService (
    private val sqlService: PageListUsuariosSqlService
) {
    fun listarUsuarios(idTenant: Long): List<ListarUsuariosBasicInfoDto> {
        return sqlService.listarUsuarios(idTenant)
    }

    fun deletarUsuario(idUsuario: Long) {
        return sqlService.deletarUsuario(idUsuario)
    }
}