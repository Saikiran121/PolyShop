# Inventory Service

**Language:** C#
**Framework:** ASP.NET Core
**Port:** 8088

## Description
Microservice responsible for tracking product stock levels.

## System Requirements
- .NET 8.0 SDK

## Installation
```bash
dotnet restore
```

## How to Run
```bash
dotnet run
```

## API Endpoints
- `GET /inventory/{productId}`: Get stock level.
- `POST /inventory/{productId}?change=5`: Adjust stock (use negative for decrease).
