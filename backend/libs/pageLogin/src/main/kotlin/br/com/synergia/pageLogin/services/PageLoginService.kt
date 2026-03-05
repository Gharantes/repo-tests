package br.com.synergia.pageLogin.services

import br.com.synergia.pageLogin.models.LoginInformationInputDto
import br.com.synergia.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.pageLogin.models.LoginTenantInformationDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageLoginService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listarTenantsLogin(): List<LoginTenantInformationDto> {
        return ListarTenantsLoginSql(Unit).query(template)
    }

    fun checkLoginInformation(
        params: LoginInformationInputDto
    ): LoginInformationResponseDto? {
        val user = CheckLoginInformationSql(params).queryForObject(template)
        if (user) {
            updateLastSeen(user.idAccount)
        }
        return user
    }
    private fun updateLastSeen(idAccount: Long) {
        val accountEntity = accountRepository.findById(idAccount).get()
        accountEntity.lastSeen = LocalDateTime.now()
        accountRepository.save(accountEntity)
    }
}