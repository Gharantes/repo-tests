package br.com.synergia.libs.entityMessage.models

/** Mensagem nova. Quem envia (`idAccount`) precisa participar da conversa. */
data class SendMessageDto(
    val idAccount: Long,
    val content: String
)
