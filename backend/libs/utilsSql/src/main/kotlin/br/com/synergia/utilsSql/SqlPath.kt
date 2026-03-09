package br.com.synergia.utilsSql

object SqlPath {
    enum class ActionAttributePermissions (override val path: String) : ISqlFile {
        ATTRIBUTE_PERMISSIONS("/sql/action-attribute-permissions/attribute-permissions.sql")
    }
    enum class PageUpsertEvento (override val path: String) : ISqlFile {
        INSERT_EVENT("/sql/page-upsert-eventos/insert-evento.sql"),
        UPDATE_EVENT("/sql/page-upsert-eventos/update-evento.sql")
    }
    enum class PageUpsertAccount (override val path: String) : ISqlFile {
        GET_ACCOUNT_BY_LOGIN_OR_EMAIL("/sql/page-upsert-account/get-account-by-login-or-email.sql"),
        INSERT_ACCOUNT("/sql/page-upsert-account/insert-account.sql"),
        UPDATE_ACCOUNT("/sql/page-upsert-account/update-account.sql")
    }
    enum class PageUpsertProject (override val path: String) : ISqlFile {
        INSERT_PROJECT("/sql/page-upsert-project/insert-project.sql"),
        UPDATE_PROJECT("/sql/page-upsert-project/update-project.sql")
    }
    enum class PageLogin (override val path: String) : ISqlFile {
        CHECK_LOGIN_INFORMATION("/sql/page-login/check-login-information.sql"),
        LIST_TENANTS("/sql/page-login/list-tenants.sql"),
        UPDATE_LAST_SEEN("/sql/page-login/update-last-seen.sql")
    }
    enum class PageListEvents (override val path: String) : ISqlFile {
        LIST_EVENTS("/sql/page-list-events/list-events.sql"),
    }
    enum class PageListTags (override val path: String) : ISqlFile {
        LIST_TAGS("/sql/page-list-tags/list-tags.sql")
    }
    enum class PageListProjects (override val path: String) : ISqlFile {
        LIST_PROJECTS("/sql/page-list-projects/list-projects.sql"),
    }
    enum class PageListPermissions (override val path: String) : ISqlFile {
        LIST_PERMISSIONS("/sql/page-list-permissions/list-permissions.sql")
    }
    enum class PageListAccounts (override val path: String) : ISqlFile {
        LIST_ACCOUNTS("/sql/page-list-accounts/list-accounts.sql")
    }
    enum class PageUpsertTenant (override val path: String) : ISqlFile {
        INSERT_TENANT("/sql/page-upsert-tenant/insert-tenant.sql"),
        UPDATE_TENANT("/sql/page-upsert-tenant/insert-tenant.sql"),
        INSERT_ADMIN_ACCOUNT("/sql/page-upsert-tenant/insert-admin-account.sql"),
        GET_TENANT_BY_IDENTIFIER("/sql/page-upsert-tenant/get-tenant-by-identifier.sql")
    }
    enum class PageExtendedEvent (override val path: String) : ISqlFile {
        LIST_PROJECTS_OF_EVENT("/sql/page-extended-event/list-projects-of-event.sql"),
        LIST_TAGS_OF_EVENT("/sql/page-extended-event/list-tags-of-event.sql")
    }
    enum class PageExtendedProject (override val path: String) : ISqlFile {
        LIST_EVENTS_OF_PROJECT("/sql/page-extended-project/list-events-of-project.sql"),
        LIST_TAGS_OF_PROJECT("/sql/page-extended-project/list-tags-of-project.sql")
    }
    enum class EntityGetById (override val path: String) : ISqlFile {
        GET_TENANT_BY_ID("/sql/entity-get-by-id/get-tenant-by-id.sql"),
        GET_EVENT_BY_ID("/sql/entity-get-by-id/get-event-by-id.sql"),
        GET_PROJECT_BY_ID("/sql/entity-get-by-id/get-project-by-id.sql")
    }
    enum class EntityDeleteById (override val path: String) : ISqlFile {
        DELETE_EVENT_BY_ID("/sql/entity-delete-by-id/delete-event-by-id.sql"),
        DELETE_PROJECT_BY_ID("/sql/entity-delete-by-id/delete-project-by-id.sql"),
        DELETE_PROJECT_EVENT_RELATIONSHIP_BY_ID_EVENT("/sql/entity-delete-by-id/delete-project-event-relationship-by-id-event.sql"),
        DELETE_PROJECT_EVENT_RELATIONSHIP_BY_ID_PROJECT("/sql/entity-delete-by-id/delete-project-event-relationship-by-id-project.sql"),
        DELETE_ACCOUNT_BY_ID("/sql/entity-delete-by-id/delete-account-by-id.sql")
    }
}
