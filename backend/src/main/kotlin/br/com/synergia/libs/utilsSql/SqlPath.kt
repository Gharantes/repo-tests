package br.com.synergia.libs.utilsSql

object SqlPath {
    enum class ActionAttributePermissions (override val path: String) : ISqlFile {
        ATTRIBUTE_PERMISSIONS("/sql/action-attribute-permissions/attribute-permissions.sql")
    }
    enum class PageUpsertAccount (override val path: String) : ISqlFile {
        GET_ACCOUNT_BY_LOGIN_OR_EMAIL("/sql/page-upsert-account/get-account-by-login-or-email.sql"),
    }
    enum class PageLogin (override val path: String) : ISqlFile {
        CHECK_LOGIN_INFORMATION("/sql/page-login/check-login-information.sql"),
    }
    enum class PageListTags (override val path: String) : ISqlFile {
        LIST_TAGS("/sql/page-list-tags/list-tags.sql")
    }
    enum class EntityEvent (override val path: String) : ISqlFile {
        LIST_EVENTS_BY_TENANT("/sql/entity-event/list-events-by-tenant.sql"),
        LIST_EVENTS_BY_ACCOUNT("/sql/entity-event/list-events-by-account.sql"),
    }
    enum class EntityProject (override val path: String) : ISqlFile {
        LIST_PROJECTS_BY_TENANT("/sql/entity-project/list-projects-by-tenant.sql"),
        LIST_PROJECTS_BY_ACCOUNT("/sql/entity-project/list-projects-by-account.sql"),
    }
    enum class PageListPermissions (override val path: String) : ISqlFile {
        LIST_PERMISSIONS("/sql/page-list-permissions/list-permissions.sql")
    }
    enum class PageListAccounts (override val path: String) : ISqlFile {
        LIST_ACCOUNTS("/sql/page-list-accounts/list-accounts.sql")
    }
    enum class PageExtendedEvent (override val path: String) : ISqlFile {
        LIST_PROJECTS_OF_EVENT("/sql/page-extended-event/list-projects-of-event.sql"),
        LIST_TAGS_OF_EVENT("/sql/page-extended-event/list-tags-of-event.sql")
    }
    enum class PageExtendedProject (override val path: String) : ISqlFile {
        LIST_EVENTS_OF_PROJECT("/sql/page-extended-project/list-events-of-project.sql"),
        LIST_TAGS_OF_PROJECT("/sql/page-extended-project/list-tags-of-project.sql")
    }
    enum class PageExtendedAccount (override val path: String) : ISqlFile {
        LIST_TAGS_OF_ACCOUNT("/sql/page-extended-account/list-tags-of-account.sql")
    }
}
