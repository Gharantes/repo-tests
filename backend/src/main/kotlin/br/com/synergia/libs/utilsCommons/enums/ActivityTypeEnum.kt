package br.com.synergia.libs.utilsCommons.enums

/** O que aconteceu num evento/projeto: postagem no feed, nota ou lista na lousa, data no calendário. */
enum class ActivityTypeEnum {
    POST,
    NOTE,
    LIST,
    DATE;

    companion object {
        fun of(noteType: NoteTypeEnum) = if (noteType == NoteTypeEnum.LIST) LIST else NOTE
    }
}
