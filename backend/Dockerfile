FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache wget unzip && \
    wget https://services.gradle.org/distributions/gradle-8.10-bin.zip -q && \
    unzip gradle-8.10-bin.zip -d /opt && \
    ln -s /opt/gradle-8.10/bin/gradle /usr/local/bin/gradle

COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

RUN gradle bootJar -x test

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]