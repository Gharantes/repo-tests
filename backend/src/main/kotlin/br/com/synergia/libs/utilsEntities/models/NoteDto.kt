package br.com.synergia.libs.utilsEntities.models

import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.enums.NoteTypeEnum
import java.time.LocalDateTime

data class NoteItemDto(
    val text: String,
    val done: Boolean
)

data class NoteDto(
    val id: Long,
    val idAccount: Long,
    val authorName: String,
    val type: NoteTypeEnum,
    val title: String,
    val content: String,
    val items: List<NoteItemDto>,
    val color: String,
    val pinned: Boolean,
    val archivedAt: LocalDateTime?,
    val updatedAt: LocalDateTime,
    val parentEntity: NoteParentEnum?,
    val parentId: Long?,
    val parentTitle: String?
)
