package br.com.synergia.libs.utilsEntities.models

import java.time.LocalDateTime

data class PostDto(
    val id: Long,
    val idAccount: Long,
    val authorName: String,
    val title: String,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
