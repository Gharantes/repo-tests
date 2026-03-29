package br.com.synergia.pageLogin.services

import br.com.synergia.pageLogin.models.LoginInformationInputDto
import br.com.synergia.pageLogin.models.LoginInformationResponseDto
import org.springframework.stereotype.Service

@Service
class PageLoginService (
    private val sqlService: PageLoginSqlService,
) {
    fun checkLoginInformation(
        params: LoginInformationInputDto
    ): LoginInformationResponseDto? {
        val user = sqlService.checkLoginInformation(params)
        if (user != null) {
            sqlService.updateLastSeen(user.idAccount)
        }
        return user
    }
}