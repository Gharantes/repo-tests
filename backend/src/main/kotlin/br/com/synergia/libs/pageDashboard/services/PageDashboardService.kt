package br.com.synergia.libs.pageDashboard.services

import br.com.synergia.libs.utilsCommons.enums.MembershipLabels
import br.com.synergia.libs.utilsEntities.models.FeedItemDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

/** Feed "Novidades" do dashboard: postagens e blocos dos eventos/projetos de que a conta participa. */
@Service
class PageDashboardService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listFeedOfAccount(idAccount: Long, limit: Int?): List<FeedItemDto> {
        val sql = SqlPath.PageDashboard.LIST_FEED_OF_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("limit", (limit ?: DEFAULT_LIMIT).coerceIn(1, MAX_LIMIT), Types.INTEGER)
            .addValue("event_lead_label", MembershipLabels.EVENT_LEAD, Types.VARCHAR)
            .addValue("project_lead_label", MembershipLabels.PROJECT_LEAD, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.feedItemRowMapper)
    }

    companion object {
        const val DEFAULT_LIMIT = 20
        const val MAX_LIMIT = 100
    }
}
