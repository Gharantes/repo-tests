package com.example.synergia.services

import com.example.synergia.repositories.pageLogin.CheckLoginInformationSql
import com.example.synergia.repositories.pageLogin.ListarTenantsLoginSql
import com.example.synergia.rest.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.rest.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.rest.pageLogin.dto.output.LoginTenantInformationDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageLoginService (
    private val template: JdbcTemplate
) {
    fun listarTenantsLogin(): List<LoginTenantInformationDto> =
        ListarTenantsLoginSql(Unit).query(template)

    fun checkLoginInformation(
        params: LoginInformationInputDto
    ): LoginInformationResponseDto? =
        CheckLoginInformationSql(params).queryForObject(template)
}