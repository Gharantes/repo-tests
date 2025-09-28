package com.example.synergia.services.byPage

import com.example.synergia.repositories.byDomain.AccountRepository
import com.example.synergia.repositories.byPage.pageLogin.CheckLoginInformationSql
import com.example.synergia.repositories.byPage.pageLogin.ListarTenantsLoginSql
import com.example.synergia.models.byPage.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.models.byPage.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.models.byPage.pageLogin.dto.output.LoginTenantInformationDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class PageLoginService (
    private val template: NamedParameterJdbcTemplate,
    private val accountRepository: AccountRepository,
) {
    fun listarTenantsLogin(): List<LoginTenantInformationDto> =
        ListarTenantsLoginSql(Unit).query(template)

    fun checkLoginInformation(
        params: LoginInformationInputDto
    ): LoginInformationResponseDto? {
        return CheckLoginInformationSql(params).queryForObject(template)?.apply {
            updateLastSeen(this.idAccount)
        }
    }
    private fun updateLastSeen(idAccount: Long) {
        val accountEntity = accountRepository.findById(idAccount).get()
        accountEntity.lastSeen = LocalDateTime.now()
        accountRepository.save(accountEntity)
    }
}