# Step 1: Build stage with Maven and Java 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy Maven POM and source files (supports both root and backend build contexts)
COPY pom.xml* backend/pom.xml* ./
COPY src* backend/src* ./src/

# Package the application skipping tests for speed
RUN mvn clean package -DskipTests

# Step 2: Runtime stage with minimal Java 17 JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Environment defaults
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=postgres

# Launch Spring Boot application using sh -c so PORT env variable is evaluated dynamically with memory limits
CMD ["sh", "-c", "java -Xmx384m -Dserver.port=${PORT:-8080} -jar app.jar"]
