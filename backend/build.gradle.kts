import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.2.5"
	id("io.spring.dependency-management") version "1.1.4"
	kotlin("jvm") version "1.9.23"
	kotlin("plugin.spring") version "1.9.23"
	// https://github.com/springdoc/springdoc-openapi-gradle-plugin
	id("org.springdoc.openapi-gradle-plugin") version "1.9.0"
}

openApi {
	apiDocsUrl.set("http://localhost:8080/v3/api-docs")
	outputDir.set(layout.projectDirectory.dir("docs"))
	outputFileName.set("${project.name}-${project.version}.json")
	waitTimeInSeconds.set(10)
	customBootRun { args.set(listOf("--spring.profiles.active=openapi")) }
}

group = "br.com.synergia"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
	mavenCentral()
}

tasks.getByName("generateOpenApiDocs") { project.ext.set("profile", "openapi") }

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	testImplementation("org.springframework.boot:spring-boot-starter-test")

	/** Bancos de Dados **/
	runtimeOnly("org.postgresql:postgresql")
	/** OPEN API **/
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.5.0")
	if (project.ext.has("profile") && project.ext.get("profile") == "openapi") {
		runtimeOnly("org.hsqldb:hsqldb")
	}
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs += "-Xjsr305=strict"
		jvmTarget = "21"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
