package br.com.synergia.rest

import br.com.synergia.libs.entityPost.models.InsertPostDto
import br.com.synergia.libs.entityPost.models.UpdatePostDto
import br.com.synergia.libs.entityPost.services.EntityPostService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.PostDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-post")
class EntityPostResource (
    private val service: EntityPostService
) {
    @PostMapping("/list-posts-of-event")
    fun listPostsOfEvent(
        @RequestParam("id-event") idEvent: Long
    ): ResponseEntity<List<PostDto>> {
        return ResponseMessenger.buildResponse {
            service.listPostsOfEvent(idEvent)
        }
    }
    @PostMapping("store")
    fun insertPost(
        @RequestBody params: InsertPostDto
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.insertPost(params)
        }
    }
    @PostMapping("update/{id-post}")
    fun updatePost(
        @PathVariable("id-post") idPost: Long,
        @RequestBody params: UpdatePostDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updatePost(idPost, params)
        }
    }
    @DeleteMapping("delete/{id-post}")
    fun deletePost(
        @PathVariable("id-post") idPost: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deletePost(idPost, idAccount)
        }
    }
}
