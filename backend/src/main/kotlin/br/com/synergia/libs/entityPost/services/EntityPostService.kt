package br.com.synergia.libs.entityPost.services

import br.com.synergia.libs.entityNotification.services.EntityNotificationService
import br.com.synergia.libs.entityPost.models.InsertPostDto
import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.entityPost.models.UpdatePostDto
import br.com.synergia.libs.utilsCommons.enums.PostEntitiesEnum
import br.com.synergia.libs.utilsEntities.jpa.post.Post
import br.com.synergia.libs.utilsEntities.models.PostDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Feed: postagens em Markdown ligadas a um evento. Só o autor edita ou apaga.
 * Postagem do Organizador avisa quem participa do evento (sino do topo).
 */
@Service
class EntityPostService (
    private val sqlService: EntityPostSqlService,
    private val notificationService: EntityNotificationService
) {
    fun listPostsOfEvent(idEvent: Long): List<PostDto> {
        return sqlService.listPostsOfEvent(idEvent)
    }

    @Transactional(rollbackFor = [Exception::class])
    fun insertPost(params: InsertPostDto): Long {
        val title = params.title.trim()
        requireContent(title, params.content)
        val id = sqlService.insertPost(params.idAccount, title, params.content)
        when (params.referenceEntity) {
            PostEntitiesEnum.EVENT -> {
                sqlService.insertEventPostRelationship(id, params.referenceId, params.idAccount)
                notificationService.notifyActivity(NoteParentEnum.EVENT, params.referenceId, params.idAccount, ActivityTypeEnum.POST, id)
            }
            PostEntitiesEnum.PROJECT -> throw UnsupportedOperationException("Feed de projeto ainda não existe.")
        }
        return id
    }

    fun updatePost(idPost: Long, params: UpdatePostDto) {
        val title = params.title.trim()
        requireContent(title, params.content)
        sqlService.updatePost(getOwnPost(idPost, params.idAccount), title, params.content)
    }

    @Transactional(rollbackFor = [Exception::class])
    fun deletePost(idPost: Long, idAccount: Long) {
        getOwnPost(idPost, idAccount)
        notificationService.deleteOfPost(idPost)
        sqlService.deletePostRelationships(idPost)
        sqlService.deletePost(idPost)
    }

    private fun requireContent(title: String, content: String) {
        require(title.isNotEmpty() || content.isNotBlank()) { "Postagem vazia." }
    }

    private fun getOwnPost(idPost: Long, idAccount: Long): Post {
        val post = sqlService.getPost(idPost)
        require(post.idAccount == idAccount) { "Postagem pertence a outro usuário." }
        return post
    }
}
