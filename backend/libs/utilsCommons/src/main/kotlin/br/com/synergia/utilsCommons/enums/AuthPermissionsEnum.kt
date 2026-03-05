package br.com.synergia.utilsCommons.enums

enum class AuthPermissionsEnum (
    val id: Long,
    val label: String,
    val description: String? = null
) {
    CREATE_USER(1, "CREATE_USER", "Permissão para criar usuários"),
    CREATE_EVENT(2, "CREATE_EVENT", "Permissão para criar eventos"),
    CREATE_TAG(3, "CREATE_TAG", "Permissão para criar tags"),
    CREATE_PROJECT(4, "CREATE_PROJECT", "Permissão para criar projetos"),

    DELETE_PROJECT_AS_NON_OWNER(5, "DELETE_PROJECT_AS_NON_OWNER", "Permissão para deletar projetos como não proprietário"),
    DELETE_EVENT_AS_NON_OWNER(6, "DELETE_EVENT_AS_NON_OWNER", "Permissão para deletar eventos como não proprietário"),

    ASSIGN_TAGS_EVENT_AS_NON_MEMBER(7, "ASSIGN_TAGS_EVENT_AS_NON_MEMBER", "Permissão para atribuir tags a eventos como não proprietário"),
    ASSIGN_TAGS_PROJECT_AS_NON_MEMBER(8, "ASSIGN_TAGS_PROJECT_AS_NON_MEMBER", "Permissão para atribuir tags a projetos como não proprietário"),

    EDIT_EVENT_AS_NON_MEMBER(9, "EDIT_EVENT_AS_NON_MEMBER", "Permissão para editar eventos como não proprietário"),
    EDIT_PROJECT_AS_NON_MEMBER(10, "EDIT_PROJECT_AS_NON_MEMBER", "Permissão para editar projetos como não proprietário")
}