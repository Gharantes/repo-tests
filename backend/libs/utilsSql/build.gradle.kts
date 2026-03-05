plugins {
    kotlin("jvm") version "1.9.25"
}

group = "br.com.synergia"
version = "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))

//    implementation(funcional.poi)
//    implementation(funcional.poi.ooxml)
//    implementation(funcional.opencsv)
    compileOnly("org.apache.poi:poi:5.2.4")
    compileOnly("org.apache.poi:poi-ooxml:5.2.4")
//    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
//    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
//    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
//    implementation("org.springframework.boot:spring-boot-starter-security")
//    implementation("org.springframework.boot:spring-boot-starter-validation")
//    implementation("org.springframework.boot:spring-boot-starter-web")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(21)
}