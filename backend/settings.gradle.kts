pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        google()
    }
}

rootProject.name = "synergia"
include("libs")

include("libs:actionAtribuirPermissoes")
include("libs:actionManageRelationships")
include("libs:pageExtendedEvento")
include("libs:pageExtendedProjeto")
include("libs:pageListEventos")
include("libs:pageListPermissoes")
include("libs:pageListProjetos")
include("libs:pageListTags")
include("libs:pageListUsuarios")
include("libs:pageLogin")
include("libs:pageUpsertEventos")
include("libs:pageUpsertProjetos")
include("libs:pageUpsertTenant")
include("libs:pageUpsertUsuario")
include("libs:utilsCommons")
include("libs:utilsInit")
include("libs:utilsSql")