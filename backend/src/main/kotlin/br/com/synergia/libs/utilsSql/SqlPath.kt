package br.com.synergia.libs.utilsSql

object SqlPath {
    enum class EntityPermission (override val path: String) : ISqlFile {
        LIST_PERMISSIONS_OF_ACCOUNT("/sql/entity-permission/list-permissions-of-account.sql"),
        UPSERT_PERMISSION("/sql/entity-permission/upsert-permission.sql"),
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
    enum class EntityTenant (override val path: String) : ISqlFile {
        DELETE_TENANT("/sql/entity-tenant/delete-tenant.sql"),
    }
    enum class EntityProject (override val path: String) : ISqlFile {
        LIST_PROJECTS_BY_TENANT("/sql/entity-project/list-projects-by-tenant.sql"),
        LIST_PROJECTS_BY_ACCOUNT("/sql/entity-project/list-projects-by-account.sql"),
    }
    enum class EntityNote (override val path: String) : ISqlFile {
        LIST_NOTES("/sql/entity-note/list-notes.sql"),
    }
    enum class EntityPost (override val path: String) : ISqlFile {
        LIST_POSTS_OF_EVENT("/sql/entity-post/list-posts-of-event.sql"),
    }
    enum class EntityCalendar (override val path: String) : ISqlFile {
        LIST_CALENDAR_ENTRIES("/sql/entity-calendar/list-calendar-entries.sql"),
    }
    enum class EntityNotification (override val path: String) : ISqlFile {
        LIST_NOTIFICATIONS_OF_ACCOUNT("/sql/entity-notification/list-notifications-of-account.sql"),
        NOTIFY_EVENT_AUDIENCE("/sql/entity-notification/notify-event-audience.sql"),
        NOTIFY_PROJECT_AUDIENCE("/sql/entity-notification/notify-project-audience.sql"),
        NOTIFY_CALENDAR_AUDIENCE("/sql/entity-notification/notify-calendar-audience.sql"),
    }
    enum class PageListPermissions (override val path: String) : ISqlFile {
        LIST_PERMISSIONS("/sql/page-list-permissions/list-permissions.sql")
    }
    enum class EntityAccount (override val path: String) : ISqlFile {
        LIST_ACCOUNTS_BY_EVENT("/sql/entity-account/list-accounts-by-event.sql"),
        LIST_ACCOUNTS_BY_PROJECT("/sql/entity-account/list-accounts-by-project.sql"),
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
