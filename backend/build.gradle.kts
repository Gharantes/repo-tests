import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "br.com.synergia"
version = "0.0.1-SNAPSHOT"

plugins {
	kotlin("jvm") version "2.4.20"
	kotlin("plugin.spring") version "2.4.20"
	kotlin("plugin.jpa") version "2.4.20"

	id("org.springframework.boot") version "3.5.16"
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
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	/** Bancos de Dados **/
	implementation("org.postgresql:postgresql")
	/** OPEN API **/
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.9.1")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.9.1")
	/**XLSX**/
	implementation("org.apache.poi:poi:5.5.1")
	implementation("org.apache.poi:poi-ooxml:5.5.1")


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
	compilerOptions {
		freeCompilerArgs.add("-Xjsr305=strict")
		jvmTarget = JvmTarget.JVM_21
	}
}

tasks.withType<Test> {
	useJUnitPlatform()

	// Sem isso o Gradle só diz "BUILD SUCCESSFUL" e some com o resultado de cada
	// teste, o que atrapalha tanto no terminal quanto na aba de log do CI.
	testLogging {
		events("passed", "skipped", "failed")
		exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
		showStandardStreams = false
	}

	// Aponta o banco de testes. Os valores padrão servem para a máquina de
	// desenvolvimento; no CI as mesmas variáveis vêm do serviço de Postgres.
	environment("TEST_DB_URL", System.getenv("TEST_DB_URL") ?: "jdbc:postgresql://localhost:5432/synergia_test")
	environment("TEST_DB_USERNAME", System.getenv("TEST_DB_USERNAME") ?: "raindrop")
	environment("TEST_DB_PASSWORD", System.getenv("TEST_DB_PASSWORD") ?: "MaybeLater")

	afterSuite(KotlinClosure2<TestDescriptor, TestResult, Unit>({ desc, result ->
		if (desc.parent == null) {
			println(
				"\nResultado: ${result.resultType} " +
					"(${result.testCount} testes, ${result.successfulTestCount} passaram, " +
					"${result.failedTestCount} falharam, ${result.skippedTestCount} pulados)"
			)
		}
	}))
}

/** Só os testes de unidade: rápidos, sem banco, sem contexto do Spring. */
tasks.register<Test>("unitTest") {
	description = "Roda apenas os testes de unidade (não precisam de banco)."
	group = "verification"
	useJUnitPlatform()
	testClassesDirs = sourceSets["test"].output.classesDirs
	classpath = sourceSets["test"].runtimeClasspath
	filter { includeTestsMatching("br.com.synergia.unit.*") }
}

/** Só os testes de integração: sobem a aplicação real contra o Postgres real. */
tasks.register<Test>("integrationTest") {
	description = "Roda apenas os testes de integração (exigem PostgreSQL no ar)."
	group = "verification"
	useJUnitPlatform()
	testClassesDirs = sourceSets["test"].output.classesDirs
	classpath = sourceSets["test"].runtimeClasspath
	filter { includeTestsMatching("br.com.synergia.integration.*") }
}

