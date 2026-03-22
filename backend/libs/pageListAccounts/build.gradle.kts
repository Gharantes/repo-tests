plugins {
    kotlin("jvm") version "1.9.25"
}

group = "br.com.synergia"
version = "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    compileOnly(project(":libs:utilsSql"))
    compileOnly("org.springframework.boot:spring-boot-starter-data-jdbc")
    testImplementation(kotlin("test"))

    compileOnly(project(":libs:utilsEntities"))
    compileOnly("org.springframework.boot:spring-boot-starter-data-jpa")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}