package br.com.synergia.libs.utilsEntities.models

import java.time.LocalDateTime

data class MessageDto(
    val id: Long,
    val idConversation: Long,
    val idAccount: Long,
    val authorName: String,
    val content: String,
    val createdAt: LocalDateTime
)
