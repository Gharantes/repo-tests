package br.com.synergia.entityPost.models

import br.com.synergia.utilsCommons.enums.PostEntitiesEnum

data class InsertPostDto(
    val idAccount: Long,
    val title: String,
    val content: String,
    val referenceId: Long,
    val referenceEntity: PostEntitiesEnum
)
