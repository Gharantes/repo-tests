import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "br.com.synergia"
version = "0.0.1-SNAPSHOT"

plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	kotlin("plugin.jpa") version "1.9.25"

	id("org.springframework.boot") version "3.5.0" apply false
	id("io.spring.dependency-management") version "1.1.7"

	id("org.springdoc.openapi-gradle-plugin") version "1.9.0"
}

repositories {
	mavenCentral()
}

openApi {
	apiDocsUrl.set("http://localhost:8080/v3/api-docs")
	outputDir.set(layout.projectDirectory.dir("docs"))
	outputFileName.set("${project.name}-${project.version}.json")
	waitTimeInSeconds.set(30)
	customBootRun { args.set(listOf("--spring.profiles.active=openapi")) }
}

java {
	sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
	mavenCentral()
}

tasks.getByName("generateOpenApiDocs") { project.ext.set("profile", "openapi") }

dependencies {
	implementation(project(":libs:actionAttributePermissions"))
	implementation(project(":libs:actionManageRelationships"))
	implementation(project(":libs:pageExtendedEvent"))
	implementation(project(":libs:pageExtendedProject"))
	implementation(project(":libs:pageListEvents"))
	implementation(project(":libs:pageListPermissions"))
	implementation(project(":libs:pageListProjects"))
	implementation(project(":libs:pageListTags"))
	implementation(project(":libs:pageListAccounts"))
	implementation(project(":libs:pageLogin"))
	implementation(project(":libs:pageUpsertEvents"))
	implementation(project(":libs:pageUpsertProjects"))
	implementation(project(":libs:pageUpsertTenant"))
	implementation(project(":libs:pageUpsertAccount"))
	implementation(project(":libs:utilsCommons"))
	implementation(project(":libs:utilsSql"))
	implementation(project(":libs:utilsEntities"))


	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	/** Bancos de Dados **/
	implementation("org.postgresql:postgresql")
	/** OPEN API **/
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.5.0")
	/**XLSX**/
	implementation("org.apache.poi:poi:5.2.4")
	implementation("org.apache.poi:poi-ooxml:5.2.4")


	if (project.ext.has("profile") && project.ext.get("profile") == "openapi") {
		runtimeOnly("org.hsqldb:hsqldb")
	}
	/* Test Dependencies */
	testImplementation("org.springframework.boot:spring-boot-starter-test")
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

subprojects {
	apply(plugin = "io.spring.dependency-management")
	repositories {
		mavenCentral()
	}
	dependencyManagement {
		imports {
			mavenBom("org.springframework.boot:spring-boot-dependencies:3.5.0")
		}
	}
}