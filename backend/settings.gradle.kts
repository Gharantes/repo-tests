pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        google()
    }
}

rootProject.name = "synergia"
include("libs")

include("libs:pageLogin")

include("libs:actionAttributePermissions")
include("libs:actionManageRelationships")

include("libs:utilsCommons")
include("libs:utilsSql")
include("libs:utilsEntities")

include("libs:entityProject")
include("libs:entityTenant")
include("libs:entityEvent")
include("libs:entityAccount")
include("libs:entityTag")
include("libs:entityPermission")
include("libs:entityPost")