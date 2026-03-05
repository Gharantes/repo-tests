package br.com.synergia.utilsCommons.objects

import br.com.synergia.utilsCommons.rowmappers.ProjetoRowMapper
import br.com.synergia.utilsCommons.rowmappers.TenantRowMapper

object EntityRowMapper {
    val projetoRowmapper = ProjetoRowMapper()
    val tenantRowmapper = TenantRowMapper()
}