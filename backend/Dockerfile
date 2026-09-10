FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Usa o wrapper do próprio repositório em vez de baixar o Gradle à mão: a versão
# passa a viver num lugar só (gradle/wrapper/gradle-wrapper.properties), e não em
# dois que precisam ser lembrados juntos.
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

RUN ./gradlew bootJar -x test

FROM eclipse-temurin:25-jre-alpine
VOLUME /tmp
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
