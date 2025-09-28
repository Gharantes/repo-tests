package com.example.synergia.repositories.statistics

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class AnonimizeViewsSql : ISqlUpdateStatement<Unit> {
    override val params: Unit = Unit
    override val sql: String = """
        WITH 
        total as (
            SELECT distinct (id_ref, entity_ref)
                id_ref,
                entity_ref,
                count(1) as qtd_views,
                MIN(at) as record_start,
                MAX(at) as record_end
            FROM statistics_views
            WHERE at < CURRENT_DATE
        ),
        uniques as (
            SELECT distinct (id_ref, entity_ref, id_account)
                id_ref,
                entity_ref,
                count(1) as qtd_unique_views
            FROM statistics_view
            WHERE at < CURRENT_DATE
        ),
        final as (
            SELECT
                t.qtd_views,
                t.qtd_unique_views,
                t.id_ref,
                t.entity_ref,
                t.record_start,
                t.record_end
            FROM total t
            INNER JOIN uniques u ON t.id_ref = u.id_ref and t.entity_ref = u.entity_ref
        )
        INSERT INTO statistics_anonimized_views (
        	qtd_views,
        	qtd_unique_views,
        	id_ref,
        	entity_ref,
        	record_start,
        	record_end
        )
        SELECT * FROM final
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {}
}