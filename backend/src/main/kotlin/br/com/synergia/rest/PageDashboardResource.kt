package br.com.synergia.rest

import br.com.synergia.libs.pageDashboard.services.PageDashboardService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.FeedItemDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-dashboard")
class PageDashboardResource (
    private val service: PageDashboardService
) {
    @PostMapping("/list-feed-of-account")
    fun listFeedOfAccount(
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("limit", required = false) limit: Int? = null
    ): ResponseEntity<List<FeedItemDto>> {
        return ResponseMessenger.buildResponse {
            service.listFeedOfAccount(idAccount, limit)
        }
    }
}
