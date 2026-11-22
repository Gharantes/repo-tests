package br.com.synergia.libs.utilsEntities.models

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import java.time.LocalDateTime

/** Um item do feed do dashboard: postagem ou bloco da lousa de um evento/projeto do usuário. */
data class FeedItemDto(
    val type: ActivityTypeEnum,
    val referenceId: Long,
    val parentEntity: NoteParentEnum,
    val parentId: Long,
    val parentTitle: String,
    val idAccount: Long,
    val authorName: String,
    /** O autor é Organizador do evento / Líder do projeto. */
    val authorIsLead: Boolean,
    val title: String,
    /** Markdown nas postagens, texto puro nas notas. */
    val content: String,
    val items: List<NoteItemDto>,
    val createdAt: LocalDateTime
)
