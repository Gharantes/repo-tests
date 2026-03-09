package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.AccountDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class AccountRowMapper : RowMapper<AccountDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): AccountDto {
        return AccountDto(
            id = rs.getLong("id_account"),
            idTenant = rs.getLong("id_tenant"),
            login = rs.getString("account_login"),
            email = rs.getString("account_email"),
            firstName = rs.getString("account_first_name"),
            lastName = rs.getString("account_last_name")
        )
    }
}