pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        google()
    }
}

rootProject.name = "synergia"
include("libs")

include("libs:actionAttributePermissions")
include("libs:actionManageRelationships")
include("libs:pageExtendedEvent")
include("libs:pageExtendedProject")
include("libs:pageListEvents")
include("libs:pageListPermissions")
include("libs:pageListProjects")
include("libs:pageListTags")
include("libs:pageListAccounts")
include("libs:pageLogin")
include("libs:pageUpsertEvents")
include("libs:pageUpsertProjects")
include("libs:pageUpsertTenant")
include("libs:pageUpsertAccount")
include("libs:utilsCommons")
include("libs:utilsSql")
include("libs:utilsEntities")