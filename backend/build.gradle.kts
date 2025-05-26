import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.4.0"
	id("io.spring.dependency-management") version "1.1.6"
	kotlin("jvm") version "1.9.23"
	kotlin("plugin.spring") version "1.9.23"
	kotlin("plugin.jpa") version "1.9.24"
	id("org.springdoc.openapi-gradle-plugin") version "1.9.0"
}

repositories {
	mavenCentral()
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

	/** JDBC **/
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	/** Bancos de Dados **/
	runtimeOnly("org.postgresql:postgresql")

	/** READ AND WRITE FILES **/
//	implementation("org.apache.poi:poi-ooxml:5.2.3")

//	implementation("jakarta.persistence:jakarta.persistence-api")
	/** JPA **/
//	implementation("org.springframework.data:spring-data-jpa")
	/** OPEN API **/
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.5.0")
	if (project.ext.has("profile") && project.ext.get("profile") == "openapi") {
		runtimeOnly("org.hsqldb:hsqldb")
	}

	/* Test Dependencies */
	val kotestVersion = "5.9.1"
	testImplementation("io.kotest:kotest-runner-junit5:$kotestVersion")
	testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")
	// Use the Kotlin JUnit 5 integration.
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
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
