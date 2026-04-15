package br.com.synergia.entityPost.services

import br.com.synergia.entityPost.models.InsertPostDto
import br.com.synergia.utilsCommons.enums.PostEntitiesEnum
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