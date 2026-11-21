package br.com.synergia.libs.entityPost.models

data class UpdatePostDto(
    val idAccount: Long,
    val title: String,
    val content: String
)
