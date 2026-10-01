# Step 1: Build stage with Maven and Java 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy Maven POM and source files
COPY pom.xml .
COPY src ./src

# Package the application skipping tests for speed
RUN mvn clean package -DskipTests

# Step 2: Runtime stage with minimal Java 17 JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/studenthub-backend-1.0.0.jar app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Environment defaults
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=postgres

# Launch Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
