package com.example.synergia.services

import com.example.synergia.domainRepositories.AccountRepository
import com.example.synergia.pageRepositories.pageLogin.CheckLoginInformationSql
import com.example.synergia.pageRepositories.pageLogin.ListarTenantsLoginSql
import com.example.synergia.rest.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.rest.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.rest.pageLogin.dto.output.LoginTenantInformationDto
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