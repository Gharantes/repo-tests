package br.com.synergia.libs.entityPost.services

import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.event.EventRepository
import br.com.synergia.libs.utilsEntities.jpa.eventPostRelationship.EventPostRelationship
import br.com.synergia.libs.utilsEntities.jpa.eventPostRelationship.EventPostRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.post.Post
import br.com.synergia.libs.utilsEntities.jpa.post.PostRepository
import br.com.synergia.libs.utilsEntities.models.PostDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDateTime

@Service
class EntityPostSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val postRepository: PostRepository,
    private val accountRepository: AccountRepository,
    private val eventRepository: EventRepository,
    private val eventPostRelationshipRepository: EventPostRelationshipRepository
) {
    fun listPostsOfEvent(idEvent: Long): List<PostDto> {
        val sql = SqlPath.EntityPost.LIST_POSTS_OF_EVENT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_event", idEvent, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.postRowMapper)
    }

    fun getPost(idPost: Long): Post {
        return postRepository.findById(idPost).orElseThrow { NoSuchElementException("Postagem $idPost não existe.") }
    }

    fun insertPost(idAccount: Long, title: String, content: String): Long {
        val post = Post(idAccount = idAccount, title = title, content = content)
        return postRepository.save(post).id!!
    }

    fun updatePost(post: Post, title: String, content: String) {
        post.title = title
        post.content = content
        post.updatedAt = LocalDateTime.now()
        postRepository.save(post)
    }

    fun deletePost(idPost: Long) {
        postRepository.deleteById(idPost)
    }

    /** O autor precisa ser do mesmo tenant do evento. */
    fun insertEventPostRelationship(idPost: Long, idEvent: Long, idAccount: Long) {
        val event = eventRepository.findById(idEvent).orElseThrow { NoSuchElementException("Evento $idEvent não existe.") }
        val account = accountRepository.findById(idAccount).orElseThrow { NoSuchElementException("Conta $idAccount não existe.") }
        require(event.idTenant == account.idTenant) { "Evento de outro tenant." }
        eventPostRelationshipRepository.save(EventPostRelationship(idEvent = idEvent, idPost = idPost))
    }

    fun deletePostRelationships(idPost: Long) {
        eventPostRelationshipRepository.deleteByIdPost(idPost)
    }
}
