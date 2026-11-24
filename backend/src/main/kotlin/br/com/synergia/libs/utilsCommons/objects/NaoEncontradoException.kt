package br.com.synergia.libs.utilsCommons.objects

/**
 * O registro pedido não existe, ou existe mas é de outra instituição. O
 * ResponseMessenger responde 404 nos dois casos, igual, para não confirmar a
 * existência de ids de outras instituições.
 */
class NaoEncontradoException : RuntimeException("Registro não encontrado.")

/** Lança [NaoEncontradoException] se o registro não for da instituição [idTenant] da sessão. */
fun exigirMesmaInstituicao(idTenantDoRegistro: Long?, idTenant: Long) {
    if (idTenantDoRegistro == null || idTenantDoRegistro != idTenant) throw NaoEncontradoException()
}
