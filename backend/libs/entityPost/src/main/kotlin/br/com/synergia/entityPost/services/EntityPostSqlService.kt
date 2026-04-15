package br.com.synergia.entityPost.services

import br.com.synergia.entityPost.models.InsertPostDto
import br.com.synergia.utilsEntities.jpa.post.Post
import br.com.synergia.utilsEntities.jpa.post.PostRepository
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class EntityPostSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val postRepository: PostRepository
) {
    fun insertPost(params: InsertPostDto): Long? {
        var post = Post()
        post.idAccount = params.idAccount
        post.title = params.title
        post.content = params.content
        post = postRepository.save(post)
        return post.id
    }

    fun insertEventPostRelationship(idPost: Long, idEvent: Long) {

    }
}