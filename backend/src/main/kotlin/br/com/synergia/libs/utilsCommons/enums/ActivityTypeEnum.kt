package br.com.synergia.libs.utilsCommons.enums

/**
 * O que aconteceu num evento/projeto: postagem no feed, nota ou lista na lousa, data no calendário,
 * pedido para participar de um projeto (REQUEST) e pedido aceito (ACCEPTED, só para quem pediu).
 * Cabe em notification.type: no máximo 10 caracteres.
 */
enum class ActivityTypeEnum {
    POST,
    NOTE,
    LIST,
    DATE,
    REQUEST,
    ACCEPTED;

    companion object {
        fun of(noteType: NoteTypeEnum) = if (noteType == NoteTypeEnum.LIST) LIST else NOTE
    }
}
