package br.com.synergia.libs.entityNote.models

import br.com.synergia.libs.utilsCommons.enums.NoteTypeEnum
import br.com.synergia.libs.utilsEntities.models.NoteItemDto

data class UpsertNoteDto(
    val idTenant: Long,
    val idAccount: Long,
    val type: NoteTypeEnum,
    val title: String,
    val content: String,
    val items: List<NoteItemDto>,
    val color: String,
    val pinned: Boolean,
    val archived: Boolean
)
