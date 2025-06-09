package com.example.synergia.repositories.attachments

import com.example.synergia.utils.extensions.getNullableLong
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class GetIdBannerEvento (
    override val params: Long
) : ISqlGetterStatement<Long?, Long> {
    override val sql: String = "SELECT id_Banner FROM event WHERE id = :id"
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }
    override val rowMapper = RowMapper<Long?> { rs, _ ->
        rs.getNullableLong("id_Banner")
    }
}