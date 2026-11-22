package br.com.synergia.libs.utilsCommons.enums

/**
 * Catálogo de permissões. É a fonte da verdade: na subida da aplicação cada constante
 * vira (ou atualiza) uma linha da tabela `permission` com o mesmo id, e o frontend usa
 * o `label` como código. Os ids nunca mudam nem são reaproveitados, porque é por eles
 * que `account_permission_relationship` aponta.
 */
enum class AuthPermissionsEnum (
    val id: Long,
    val label: String,
    val description: String? = null,
    val category: String = "Geral",
    /** Recebida por toda conta nova criada pela página de Usuários. */
    val grantedByDefault: Boolean = false,
) {
    // Páginas
    VIEW_ACCOUNTS_PAGE(11, "VIEW_ACCOUNTS_PAGE", "Abrir a página de Usuários", "Páginas"),
    VIEW_TAGS_PAGE(12, "VIEW_TAGS_PAGE", "Abrir a página de Tags", "Páginas"),
    VIEW_PERMISSIONS_PAGE(13, "VIEW_PERMISSIONS_PAGE", "Abrir a página de Permissões", "Páginas"),

    // Usuários
    CREATE_USER(1, "CREATE_USER", "Criar usuários", "Usuários"),
    EDIT_USER(14, "EDIT_USER", "Editar outros usuários (cada um sempre pode editar a própria conta)", "Usuários"),
    DELETE_USER(17, "DELETE_USER", "Excluir usuários", "Usuários"),

    // Tags
    CREATE_TAG(3, "CREATE_TAG", "Criar tags", "Tags"),
    EDIT_TAG(15, "EDIT_TAG", "Editar tags", "Tags"),
    DELETE_TAG(18, "DELETE_TAG", "Excluir tags", "Tags"),

    // Projetos
    CREATE_PROJECT(4, "CREATE_PROJECT", "Criar projetos", "Projetos", grantedByDefault = true),
    EDIT_PROJECT_AS_NON_MEMBER(10, "EDIT_PROJECT_AS_NON_MEMBER", "Editar projetos dos quais não é membro", "Projetos"),
    ASSIGN_TAGS_PROJECT_AS_NON_MEMBER(8, "ASSIGN_TAGS_PROJECT_AS_NON_MEMBER", "Mudar as tags de projetos dos quais não é membro", "Projetos"),
    DELETE_PROJECT_AS_NON_OWNER(5, "DELETE_PROJECT_AS_NON_OWNER", "Excluir projetos dos quais não é dono", "Projetos"),

    // Eventos
    CREATE_EVENT(2, "CREATE_EVENT", "Criar eventos", "Eventos", grantedByDefault = true),
    EDIT_EVENT_AS_NON_MEMBER(9, "EDIT_EVENT_AS_NON_MEMBER", "Editar eventos dos quais não é membro", "Eventos"),
    ASSIGN_TAGS_EVENT_AS_NON_MEMBER(7, "ASSIGN_TAGS_EVENT_AS_NON_MEMBER", "Mudar as tags de eventos dos quais não é membro", "Eventos"),
    DELETE_EVENT_AS_NON_OWNER(6, "DELETE_EVENT_AS_NON_OWNER", "Excluir eventos dos quais não é dono", "Eventos"),

    // Permissões
    MANAGE_PERMISSIONS(16, "MANAGE_PERMISSIONS", "Conceder e remover permissões de usuários", "Permissões");

    companion object {
        fun byId(id: Long): AuthPermissionsEnum? = entries.firstOrNull { it.id == id }
        fun defaults(): List<AuthPermissionsEnum> = entries.filter { it.grantedByDefault }
    }
}
