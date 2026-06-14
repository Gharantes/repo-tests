package br.com.synergia.libs.entityPost.services

import br.com.synergia.libs.entityPost.models.InsertPostDto
import br.com.synergia.libs.utilsCommons.enums.PostEntitiesEnum
import org.springframework.stereotype.Service

@Service
class EntityPostService (
    private val sqlService: EntityPostSqlService
) {
    fun insertPost(params: InsertPostDto) {
        val id = sqlService.insertPost(params)
        if (id != null) {
           when(params.referenceEntity) {
               PostEntitiesEnum.EVENT -> sqlService.insertEventPostRelationship(id, params.referenceId)
               PostEntitiesEnum.PROJECT -> {}
           }
        }
    }
}