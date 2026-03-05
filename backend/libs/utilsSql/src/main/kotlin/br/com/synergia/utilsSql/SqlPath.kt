package br.com.synergia.utilsSql

object SqlPath {
    enum class PageUpsertEvento (override val path: String) : ISqlFile {
        GET_CREATE_EVENTO_DTO_BY_ID("/sql/page-upsert-eventos/get-upsert-evento-by-id.sql"),
        INSERT_EVENTO("/sql/page-upsert-eventos/insert-evento.sql"),
        UPDATE_EVENTO("/sql/page-upsert-eventos/update-evento.sql")
    }
    enum class PageUpsertProjeto (override val path: String) : ISqlFile {
        GET_CREATE_EVENTO_DTO_BY_ID("/sql/page-upsert-projetos/get-upsert-projeto-by-id.sql"),
        INSERT_PROJETO("/sql/page-upsert-projetos/insert-projeto.sql"),
        UPDATE_PROJETO("/sql/page-upsert-projetos/update-projeto.sql")
    }
    enum class PageListEventos (override val path: String) : ISqlFile {
        LISTAR_EVENTOS("/sql/page-list-eventos/listar-eventos.sql"),
        GET_EVENTO_BY_ID("/sql/page-list-eventos/get-evento-by-id.sql"),
        DELETE_EVENTO("/sql/page-list-eventos/delete-evento.sql"),
    }
    enum class PageListTags (override val path: String) : ISqlFile {
        LISTAR_TAGS("/sql/page-list-tags/listar-tags.sql")
    }
    enum class PageListProjetos (override val path: String) : ISqlFile {
        LISTAR_PROJETOS("/sql/page-list-projetos/listar-projetos.sql"),
        DELETAR_PROJETO("/sql/page-list-projetos/deletar-projeto.sql")
    }
    enum class PageListUsuarios (override val path: String) : ISqlFile {
        LISTAR_USUARIOS("/sql/page-list-usuarios/listar-usuarios.sql")
    }
    enum class PageUpsertTenant (override val path: String) : ISqlFile {
        INSERT_TENANT("/sql/page-upsert-tenant/insert-tenant.sql"),
        INSERT_ADMIN_ACCOUNT("/sql/page-upsert-tenant/insert-admin-account.sql")
    }
    enum class PageExtendedEvento (override val path: String) : ISqlFile {
        LISTAR_PROJETOS_DO_EVENTO("/sql/page-extended-evento/listar-projetos-do-evento.sql"),
        LISTAR_TAGS_DO_EVENTO("/sql/page-extended-evento/listar-tags-do-evento.sql")
    }
    enum class PageExtendedProjeto (override val path: String) : ISqlFile {
        GET_EXTENDED_PROJETO_DETAILS_BY_ID("/sql/page-extended-projeto/get-extended-projeto-details-by-id.sql")
    }
}
