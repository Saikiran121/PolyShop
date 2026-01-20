# User Service

**Language:** Java
**Framework:** Javalin
**Port:** 8085

## Description
Microservice responsible for user profile management.

## System Requirements
- Java 17+
- Maven

## Installation
```bash
mvn clean package
```

## How to Run
```bash
java -jar target/user-service-1.0-SNAPSHOT.jar
```

## API Endpoints
- `GET /users/{id}`: Get user details.
- `POST /users`: Create/Update user. Body: `{ "id": "3", "name": "Charlie", "email": "charlie@example.com" }`
