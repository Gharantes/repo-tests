package br.com.synergia.libs.utilsEntities.models

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import java.time.LocalDateTime

data class NotificationDto(
    val id: Long,
    val type: ActivityTypeEnum,
    val parentEntity: NoteParentEnum,
    val parentId: Long,
    val parentTitle: String,
    val referenceId: Long,
    val referenceTitle: String,
    val actorName: String,
    val createdAt: LocalDateTime,
    val readAt: LocalDateTime?
)
